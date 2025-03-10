////////////////////
//Main Function that returns the 5 most rated movies based on their reviews from the last 30 days.
///////////////////

export async function top5Movies(cmsAdapter) {
  try {
    const movies = await cmsAdapter.loadMovies();

    //Creates a date thats always 30 days ago (back in time)
    // const thirtyDaysAgo = new Date();
    // thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    //Using Promise.all to get all reviews at the same time.
    const moviesWithReviews = await Promise.all(
      // Goes through every movie and gets its review.
      movies.map(async (movie) => {
        try {
          const reviews = await cmsAdapter.loadReviews(movie.id);
          //Returns the movie with the movies attribute and adds reviews.
          return {
            ...movie,
            reviews,
          };
        } catch (error) {
          console.error(`Error while trying to get reviews for: ${movie.title}:`, error);
          return {
            ...movie,
            reviews: [], //return empty array if error so other movies can proceed.
          };
        }
      })
    );

    //Calculates average rating every movie.
    const moviesWithRating = moviesWithReviews
      .map((movie) => {
        // Filters out valid reviews by using the isValidReview function.
        const validReviews = movie.reviews.filter((review) => isValidReview(review, thirtyDaysAgo));
        // Calculates the average rating by using the calculateAverageRaintg function.
        const averageRating = calculateAverageRating(validReviews);

        //returns movie and its averagerating and number of reviews.
        return {
          ...movie,
          averageRating,
          reviewCount: validReviews.length,
        };
      })
      .filter((movie) => movie.averageRating !== null); //Removes all the movies that does not have a valid review.

    // Sorts movies and choose top 5, uses sortMovies function here.
    const topMovies = moviesWithRating.sort(sortMovies).slice(0, 5);

    //Return the top 5 movies.
    return topMovies;
  } catch (error) {
    console.error('Fel vid hämtning av topp 5 filmer:', error);
    return []; // Empty array if error.
  }
}

////////////////////
//Support functions
///////////////////

//Function to filter away reviews that are older than 30 days, and does not have a rating.
export function isValidReview(review, thirtyDaysAgo) {
  const reviewDate = new Date(review.attributes.createdAt);
  return review.attributes.rating !== null && reviewDate >= thirtyDaysAgo; // return the value if the rating is not null & the review date in newer then 30 days ago.
}

// Function to calculate the average rating for an array of reviews.
export function calculateAverageRating(reviews) {
  if (reviews.length === 0) return null;
  const sum = reviews.reduce((total, review) => total + review.attributes.rating, 0); // Goes through all reviews in the array and adds their total value, starting from 0
  return sum / reviews.length; //returns the average value by deviding the sum with the length of the array.
}

// Function to sort movies first based of rating, if rating is equal, than based on number of reviews.
export function sortMovies(a, b) {
  //if the average rating is not equal to to the other, then we return the one with the highest rating.
  if (b.averageRating !== a.averageRating) {
    return b.averageRating - a.averageRating;
  }
  return b.reviewCount - a.reviewCount; // If they have the same rating, we base the "rating" from number of reviews.
}
