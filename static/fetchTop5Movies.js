(async () => {
  try {
    const reponse = await fetch('/api/top-movies');
    const { movies } = await reponse.json();

    const container = document.querySelector('.movie-container');

    movies.forEach((movie) => {
      const card = document.createElement('div');
      card.classList.add('movie-card');

      //Creates the picture
      const linkImage = document.createElement('a');
      linkImage.href = `movies/${movie.id}`;
      const img = document.createElement('img');
      img.src = movie.image.url;
      img.alt = movie.title;
      linkImage.appendChild(img);

      //Creates the link with a title
      const linkTitle = document.createElement('a');
      linkTitle.href = `/movies/${movie.id}`;
      const h2 = document.createElement('h2');
      h2.textContent = movie.title;
      linkTitle.appendChild(h2);

      card.appendChild(linkImage);
      card.appendChild(linkTitle);
      container.appendChild(card);
    });
  } catch (error) {
    console.log('Could not get top 5 movies at this time.', error);
  }
})();
