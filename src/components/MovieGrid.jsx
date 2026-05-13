import { useState } from "react";
import MovieCard from "./MovieCard";

function MovieGrid({ movies, onSelect }) {
  const [view, setView] = useState("grid"); // "grid" or "list"

  return (
    <div>
      <div className="trending-header">
        <h2 className="section-title" style={{ marginBottom: 0 }}>
          Trending Now
        </h2>
        <div className="view-toggle">
          <button
            className={`view-btn ${view === "list" ? "active" : ""}`}
            onClick={() => setView("list")}
            title="List view"
          >
            ☰
          </button>
          <button
            className={`view-btn ${view === "grid" ? "active" : ""}`}
            onClick={() => setView("grid")}
            title="Grid view"
          >
            ⊞
          </button>
        </div>
      </div>

      <div className={`movie-grid ${view === "list" ? "list-view" : ""}`}>
        {movies.length === 0 ? (
          <div className="no-results">
            <p>No movies found. Try a different search or genre.</p>
          </div>
        ) : (
          movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={onSelect}
              listView={view === "list"}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default MovieGrid;
