import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { calculateAverageRating, isValidReview, sortMovies, top5Movies } from './top5Movies.js';

////////////////////////////////
//Test for the main function top5Movies() in top5Movies.js
///////////////////////////////

describe('top5Movies()', () => {
  beforeEach(() => {
    jest.useFakeTimers(); //Let us mock the time for each test.
  });

  afterEach(() => {
    jest.clearAllTimers(); //Clear mocked time after each test.
  });
  //Help function to create a review-object which can be overridden. (used in test 2)
  function mockReview(overrides) {
    return {
      id: 1,
      attributes: {
        rating: 5,
        createdAt: '2025-01-20T13:37:00.000Z',
        ...overrides,
      },
    };
  }
  ///////
  //Test 1 for top5Movies function
  //////
  it('Returns empty array when no movies exist', async () => {
    //Mocking the data here through dependency injection by using mocked data below.
    const cmsAdapter = {
      loadMovies: async () => [],
      loadReviews: async () => [],
    };

    const movies = await top5Movies(cmsAdapter);
    expect(movies).toHaveLength(0); //expect the array to be empty.
  });
  ///////
  //Test 2 for top5Movies function
  //////
  it('Returns top 5 movies sorted by rating and review count', async () => {
    jest.setSystemTime(new Date(2025, 1, 2));
    const cmsAdapter = {
      loadMovies: async () => [
        { id: 1, title: 'Pulp Fiction' },
        { id: 2, title: 'Training Day' },
        { id: 3, title: 'Encanto' },
      ],
      //Mocking the reviews for each movie
      loadReviews: async (movieId) => {
        const reviews = {
          1: [mockReview({ rating: 5 }), mockReview({ rating: 5 })],
          2: [mockReview({ rating: 5 }), mockReview({ rating: 5 }), mockReview({ rating: 5 })],
          3: [mockReview({ rating: 4 })],
        };
        return reviews[movieId]; //Returns reviews for specifik movieId.
      },
    };
    //Runs the function with our mocked data
    const movies = await top5Movies(cmsAdapter);
    expect(movies).toHaveLength(3); //Should have 3 movies
    expect(movies[0].id).toBe(2); //Training Day should be first due to rating 5 & most reviews.
    expect(movies[1].id).toBe(1); //Pulp Fiction second, rating 5 but less reviews.
    expect(movies[2].id).toBe(3); //Encanto last, rating 4.
  });

  it('Returns only movies with valid reviews from last 30 days', async () => {
    jest.setSystemTime(new Date(2025, 1, 2));

    const cmsAdapter = {
      loadMovies: async () => [
        { id: 1, title: 'Pulp Fiction' },
        { id: 2, title: 'Training Day' },
        { id: 3, title: 'Encanto' },
        { id: 4, title: 'Min granne Totoro' },
        { id: 5, title: 'The Shawshank Redemption' },
      ],
      loadReviews: async (movieId) => {
        const reviews = {
          1: [mockReview({ rating: 5 }), mockReview({ rating: 5 })],
          2: [mockReview({ rating: 3, createdAt: '2024-12-20T13:37:00.000Z' })],
          3: [mockReview({ rating: null })],
          4: [mockReview({ rating: 5 }), mockReview({ rating: 4 })],
          5: [mockReview({ rating: 5 }), mockReview({ rating: 5 }), mockReview({ rating: 5 })],
        };
        return reviews[movieId];
      },
    };

    const movies = await top5Movies(cmsAdapter);
    expect(movies).toHaveLength(3); //Expects length 3
    expect(movies[0].id).toBe(5); //Shawshank should be first, 5 star 3 reviews.
    expect(movies[1].id).toBe(1); // Pulp Fiction second, 2 star, 2 reviews.
    expect(movies[2].id).toBe(4); // Min granne Totoro third
  });

  it('Only shows 5 movies total', async () => {
    jest.setSystemTime(new Date(2025, 1, 2));
    const cmsAdapter = {
      loadMovies: async () => [
        { id: 1, title: 'Pulp Fiction' },
        { id: 2, title: 'Training Day' },
        { id: 3, title: 'The Shawshank Redemption' },
        { id: 4, title: 'Min granne Totoro' },
        { id: 5, title: 'The Muppets' },
        { id: 6, title: 'Fire Walk With Me' },
      ],
      loadReviews: async () => [mockReview({ rating: 5 })],
    };

    const movies = await top5Movies(cmsAdapter);
    expect(movies).toHaveLength(5); //expected to only show 5 even though we have 6 input, due to slice(0, 5).
  });
});

////////////////////////////////
//Test for the isValidReview-function in top5Movies.js
///////////////////////////////

describe('isValidReview()', () => {
  beforeEach(() => {
    jest.useFakeTimers(); //Let us mock the time for each test.
  });

  afterEach(() => {
    jest.clearAllTimers(); //Clear mocked time after each test.
  });

  ///////
  //Test 1 for isValidReview function
  //////

  it('Returns true if a review is withing 30 days and with rating.', () => {
    jest.setSystemTime(new Date(2025, 1, 2));

    //Creates a date 30 days ago from "today (which is 2025-02-02)
    const thirtyDaysAgo = new Date(2025, 1, 2);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const review = {
      attributes: {
        rating: 4,
        createdAt: '2025-01-20T13:37:00.000Z',
      },
    };

    expect(isValidReview(review, thirtyDaysAgo)).toBe(true);
  });

  ///////
  //Test 2 for isValidReview function
  //////

  it('Returns false if the review is older then 30 days.', () => {
    jest.setSystemTime(new Date(2025, 1, 2));

    const thirtyDaysAgo = new Date(2025, 1, 2);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const review = {
      attributes: {
        rating: 4,
        createdAt: '2024-12-20T13:37:00.000Z', //Added a date thats more than 30 days old.
      },
    };
    expect(isValidReview(review, thirtyDaysAgo)).toBe(false);
  });

  ///////
  //Test 3 for isValidReview function
  //////

  it('Returns false for review without rating', () => {
    jest.setSystemTime(new Date(2025, 1, 2));

    const thirtyDaysAgo = new Date(2025, 1, 2);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const review = {
      attributes: {
        rating: null, //Using null here, since that not a valid rating for this function.
        createdAt: '2025-01-20T13:37:00.000Z',
      },
    };
    expect(isValidReview(review, thirtyDaysAgo)).toBe(false);
  });
});

////////////////////////////////
//Test for the calculateAverageRating function in top5Movies.js
///////////////////////////////

describe('calculateAverageRating()', () => {
  ///////
  //Test 1 for calculateAverageRating function
  //////
  it('Returns null if reviews array is empty', () => {
    const reviews = [];
    expect(calculateAverageRating(reviews)).toBe(null);
  });
  ///////
  //Test 2 for calculateAverageRating function
  //////
  it('Returns correct rating when only one review exists', () => {
    const reviews = [
      {
        attributes: {
          rating: 4,
        },
      },
    ];
    expect(calculateAverageRating(reviews)).toBe(4);
  });
  ///////
  //Test 3 for calculateAverageRating function
  //////
  it('Calculates correct average for multiple reviews', () => {
    const reviews = [
      {
        attributes: {
          rating: 4,
        },
      },
      {
        attributes: {
          rating: 2,
        },
      },
      {
        attributes: {
          rating: 3,
        },
      },
    ];
    expect(calculateAverageRating(reviews)).toBe(3);
  });
});

////////////////////////////////
//Test for the sortMovies function in top5Movies.js
///////////////////////////////

describe('SortMovies()', () => {
  ///////
  //Test 1 for sortMovies function
  //////
  it('sorts movies based on the average rating, where highest rating gets sorted first.', () => {
    const movie1 = {
      averageRating: 4,
      reviewCount: 2,
    };
    const movie2 = {
      averageRating: 5,
      reviewCount: 1,
    };

    expect(sortMovies(movie1, movie2)).toBeGreaterThan(0); //movie 2 should come before movie 1
    expect(sortMovies(movie2, movie1)).toBeLessThan(0); // And here movie 2 should come before movie 1
  });

  it('Sorts a movie based on review count. If a movie has the same rating but higher reviews, it gets sorted first.', () => {
    const movie1 = {
      averageRating: 4,
      reviewCount: 2,
    };
    const movie2 = {
      averageRating: 4,
      reviewCount: 5,
    };

    expect(sortMovies(movie1, movie2)).toBeGreaterThan(0);
    expect(sortMovies(movie2, movie1)).toBeLessThan(0);
  });
});
