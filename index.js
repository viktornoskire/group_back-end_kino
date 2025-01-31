import { loadMovie, loadMovies, loadReviews } from './src/movies.js';
import initialize from './src/app.js';

const myAPI = {
  loadMovie,
  loadMovies,
  loadReviews,
};

const app = initialize(myAPI);

app.listen(5080);
