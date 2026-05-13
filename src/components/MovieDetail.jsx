import { useState, useEffect } from "react";
import { fetchMovieDetail, IMG, IMG_ORIGINAL } from "../data/tmdb";
import MovieCard from "./MovieCard";

function MovieDetail({ movie, onBack, watchlist, setWatchlist, onSelectMovie, onSelectActor }) {
  const [detail, setDetail] = useState(null);
  const [credits, setCredits] = useState(null);
  const [videos, setVideos] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);

  const isInWatchlist = watchlist.some((m) => m.id === movie.id);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setShowTrailer(false);
      const data = await fetchMovieDetail(movie.id);
      setDetail(data.detail);
      setCredits(data.credits);
      setVideos(data.videos?.results || []);
      setSimilar(data.similar?.results?.slice(0, 6) || []);
      setLoading(false);
    }
    load();
  }, [movie.id]);

  function toggleWatchlist() {
    if (isInWatchlist) {
      setWatchlist(watchlist.filter((m) => m.id !== movie.id));
    } else {
      setWatchlist([...watchlist, movie]);
    }
  }

  const poster = movie.poster_path
    ? `${IMG}${movie.poster_path}`
    : "https://via.placeholder.com/300x450?text=No+Image";

  const backdrop = movie.backdrop_path
    ? `${IMG_ORIGINAL}${movie.backdrop_path}`
    : null;

  const year = movie.release_date ? movie.release_date.slice(0, 4) : "N/A";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

  const cast = credits?.cast?.slice(0, 6) || [];
  const director = credits?.crew?.find((c) => c.job === "Director");
  const composer = credits?.crew?.find((c) => c.job === "Original Music Composer");

  const crewToShow = [
    ...(director ? [{ ...director, role: "Director" }] : []),
    ...(composer ? [{ ...composer, role: "Composer" }] : []),
  ];

  const genres = detail?.genres || [];
  const runtime = detail?.runtime
    ? `${Math.floor(detail.runtime / 60)}h ${detail.runtime % 60}m`
    : "N/A";

  // Find best trailer
  const trailer = videos.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  ) || videos.find((v) => v.site === "YouTube");

  return (
    <div>
      {/* Backdrop */}
      {backdrop && !showTrailer && (
        <img className="detail-backdrop" src={backdrop} alt={movie.title} />
      )}

      {/* Trailer Modal */}
      {showTrailer && trailer && (
        <div className="trailer-overlay" onClick={() => setShowTrailer(false)}>
          <div className="trailer-container" onClick={(e) => e.stopPropagation()}>
            <button className="trailer-close" onClick={() => setShowTrailer(false)}>✕</button>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              title="Trailer"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      )}

      <button className="back-btn" onClick={onBack}>← Back</button>

      {loading ? (
        <div className="loading" style={{ padding: "60px 40px" }}>
          <div className="spinner"></div>
          <p>Loading details...</p>
        </div>
      ) : (
        <>
          <div className="detail-body">
            {/* Left */}
            <div className="detail-poster">
              <div className="detail-poster-label">MOVIE DETAILS</div>
              <img src={poster} alt={movie.title} />
              <button className="btn-watchlist" onClick={toggleWatchlist}>
                {isInWatchlist ? "✓ In Watchlist" : "+ Add to Watchlist"}
              </button>
              <button
                className="btn-trailer"
                onClick={() => trailer ? setShowTrailer(true) : alert("No trailer available.")}
              >
                ▶ Watch Trailer
              </button>
            </div>

            {/* Right */}
            <div className="detail-info">
              <div className="detail-badges">
                <span className="meta-badge">{year}</span>
                <span className="meta-badge">{detail?.adult ? "R" : "PG-13"}</span>
                <span className="meta-badge">{runtime}</span>
                <span className="rating-badge">
                  ⭐ <span className="score">{rating}</span>
                  <span className="of">/ 10</span>
                </span>
              </div>

              <h1 className="detail-title">{movie.title.toUpperCase()}</h1>

              <div className="genre-tags">
                {genres.map((g) => (
                  <span key={g.id} className="genre-tag">{g.name}</span>
                ))}
              </div>

              <h3 className="detail-section-title">Synopsis</h3>
              <p className="detail-synopsis">{detail?.overview || "No synopsis available."}</p>

              <h3 className="detail-section-title">Cast & Crew</h3>
              <div className="cast-grid">
                {cast.map((person) => (
                  <div
                    key={person.id}
                    className="cast-card clickable"
                    onClick={() => onSelectActor(person)}
                  >
                    <div className="cast-name">{person.name}</div>
                    <div className="cast-role">{person.character}</div>
                    <div className="cast-hint">View filmography →</div>
                  </div>
                ))}
                {crewToShow.map((person) => (
                  <div
                    key={person.id + person.role}
                    className="cast-card clickable"
                    onClick={() => onSelectActor(person)}
                  >
                    <div className="cast-name">{person.name}</div>
                    <div className="cast-role">{person.role}</div>
                    <div className="cast-hint">View filmography →</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Similar Movies */}
          {similar.length > 0 && (
            <div className="similar-section">
              <h3 className="detail-section-title" style={{ marginBottom: 20 }}>
                Similar Movies
              </h3>
              <div className="movie-grid">
                {similar.map((m) => (
                  <MovieCard key={m.id} movie={m} onClick={onSelectMovie} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MovieDetail;
