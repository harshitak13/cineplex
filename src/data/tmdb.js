const API_KEY = process.env.REACT_APP_TMDB_KEY;
const BASE = "https://api.themoviedb.org/3";
export const IMG = "https://image.tmdb.org/t/p/w500";
export const IMG_ORIGINAL = "https://image.tmdb.org/t/p/original";

export async function fetchTrending(page = 1) {
  const res = await fetch(`${BASE}/trending/movie/week?api_key=${API_KEY}&page=${page}`);
  const data = await res.json();
  return { results: data.results || [], totalPages: data.total_pages || 1 };
}

export async function fetchByGenre(genreId, page = 1) {
  const res = await fetch(
    `${BASE}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&page=${page}`
  );
  const data = await res.json();
  return { results: data.results || [], totalPages: data.total_pages || 1 };
}

export async function searchMovies(query, page = 1) {
  const res = await fetch(
    `${BASE}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
  );
  const data = await res.json();
  return { results: data.results || [], totalPages: data.total_pages || 1 };
}

export async function fetchMovieDetail(id) {
  const [detail, credits, videos, similar] = await Promise.all([
    fetch(`${BASE}/movie/${id}?api_key=${API_KEY}`).then((r) => r.json()),
    fetch(`${BASE}/movie/${id}/credits?api_key=${API_KEY}`).then((r) => r.json()),
    fetch(`${BASE}/movie/${id}/videos?api_key=${API_KEY}`).then((r) => r.json()),
    fetch(`${BASE}/movie/${id}/similar?api_key=${API_KEY}`).then((r) => r.json()),
  ]);
  return { detail, credits, videos, similar };
}

export async function fetchActorMovies(actorId) {
  const [person, credits] = await Promise.all([
    fetch(`${BASE}/person/${actorId}?api_key=${API_KEY}`).then((r) => r.json()),
    fetch(`${BASE}/person/${actorId}/movie_credits?api_key=${API_KEY}`).then((r) => r.json()),
  ]);
  return { person, credits };
}

export const GENRE_MAP = {
  Action: 28,
  Comedy: 35,
  Drama: 18,
  "Sci-Fi": 878,
  Horror: 27,
  Romance: 10749,
  Thriller: 53,
  Animation: 16,
};
