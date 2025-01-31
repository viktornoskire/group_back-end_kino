import fetch from 'node-fetch';

const apiBase = 'https://plankton-app-xhkom.ondigitalocean.app/api';

export async function loadScreenings() {
  const res = await fetch(`${apiBase}/screenings?populate=movie`);
  const payload = await res.json();

  return payload.data.map((screening) => ({
    id: screening.id,
    movie: screening.attributes.movie.data.attributes.title,
    start_time: screening.attributes.start_time,
    room: screening.attributes.room,
  }));
}
