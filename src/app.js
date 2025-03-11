import express from 'express';
import createData from './db.js';
import { loadScreenings } from './screeningsFrontpage.js';
import { top5Movies } from './top5Movies.js';
import cmsScreening from './movies.js';
import { getMovieRating } from './rating.js';
import cmsAdapterRating from './cmsAdapterRating.js';
import cmsAdapter from './cmsAdapterTop5Movies.js';
import cmsReviews from '../static/cmsReviews.js';
import { reviewAdapter } from './sendReviews.js';

export default function initialize(api) {
  const app = express();
  app.set('view engine', 'pug');

  app.get('/', async (req, res) => {
    res.render('home', {
      data: createData(),
    });
  });

  app.get('/api/top-movies', async (req, res) => {
    try {
      const movies = await top5Movies(cmsAdapter);
      res.json({
        movies: movies.map((movie) => ({
          id: movie.id,
          title: movie.title,
          image: movie.image,
        })),
      });
    } catch (error) {
      console.error('Could not get top 5 movies', error);
      res.status(500).json({ error: 'Could not load top 5 movies at this time.' });
    }
  });

  app.get('/movies/:id', async (req, res) => {
    const id = req.params.id;
    try {
      const movie = await api.loadMovie(id);

      if (!movie) {
        return res.status(404).render('404', { data: createData() });
      }

      res.render('movie', {
        data: createData(),
        movie: movie,
        movieId: id,
      });
    } catch (err) {
      console.error(err.message);
      res.status(404).render('404', { data: createData() });
    }
   });

  app.get('/api/reviews/:id/:page', async (req, res) => {
    const id = req.params.id;
    const page = req.params.page || 1;
    const pageSize = 5;

    try {
      const dataReview = await api.getReviews(cmsReviews, id, page, pageSize);

      if (!dataReview || dataReview.reviews.length == 0) {
        return res.status(500).json({ error: 'Recensioner hittades inte' });
      }

      res.json({
        reviews: dataReview.reviews.map((review) => ({
          author: review.author,
          rating: review.rating,
          comment: review.comment,
        })),
        pagination: dataReview.pagination,
      });
    } catch (err) {
      console.error(err.message);
      res.status(404);
    }
  });

  app.get('/about', async (req, res) => {
    res.render('about', { data: createData() });
  });

  app.get('/kids', async (req, res) => {
    res.render('kids', { data: createData() });
  });

  app.get('/api/screenings', async (req, res) => {
    try {
      const screenings = await loadScreenings();
      res.json(screenings);
    } catch (error) {
      console.error('Fel vid hämtning av visningar:', error);
      res.status(500).json({ error: 'Kunde inte ladda visningar' });
    }
  });

  app.get('/api/screenings/:id', async (req, res) => {
    try {
      const movieID = req.params.id;
      const screenings = await cmsScreening.loadScreeningsID(req, res);
      const rating = await getMovieRating(cmsAdapterRating, movieID);

      if (!screenings) {
        throw new Error('Array does not contain any screenings.');
      }

      res.json({
        data: screenings,
        rating: rating,
      });
    } catch (e) {
      console.error(`Problems with fetching the screenings, ${e}`);
      res.status(500).json({ message: 'Could not fetch any screenings' });
    }
  });

  app.post("/api/login", (req, res) => {
    reviewAdapter.loadLogin(req, res);
  });

  app.get('/api/reviews', (req, res) => {
    reviewAdapter.sendReviewAccess(req, res);
  });

  app.use('/static', express.static('./static'));
  app.use('/img', express.static('./public/img'));
  app.use('/movies/static', express.static('./static'));
  app.use('/movies/img', express.static('./public/img'));

  app.use(function (req, res) {
    res.status(404).render('404', { data: createData() });
  });

  return app;
}
