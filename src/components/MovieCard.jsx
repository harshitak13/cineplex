import { IMG } from "../data/tmdb";

function MovieCard({ movie, onClick }) {
  const poster = movie.poster_path
    ? `${IMG}${movie.poster_path}`
    : "https://via.placeholder.com/300x450?text=No+Image";

  const year = movie.release_date ? movie.release_date.slice(0, 4) : "N/A";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

  return (
    <div className="movie-card" onClick={() => onClick(movie)}>
      <div className="card-poster">
        <img src={poster} alt={movie.title} />
      </div>
      <div className="card-info">
        <div className="card-title">{movie.title}</div>
        <div className="card-meta">
          <span>{year}</span>
          <span className="card-rating">⭐ {rating}</span>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
