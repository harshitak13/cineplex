import { useState } from "react";
import "./App.css";
import movies from "./data/movies";
import Navbar from "./components/Navbar";
import GenreFilter from "./components/GenreFilter";
import MovieGrid from "./components/MovieGrid";
import MovieDetail from "./components/MovieDetail";

function App() {
  const [page, setPage] = useState("home");         // "home" | "watchlist" | "detail"
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [activeGenre, setActiveGenre] = useState("All");
  const [search, setSearch] = useState("");
  const [watchlist, setWatchlist] = useState([]);

  // Filter movies by genre + search
  const filtered = movies.filter((movie) => {
    const matchesGenre =
      activeGenre === "All" || movie.genre.includes(activeGenre);
    const query = search.toLowerCase();
    const matchesSearch =
      movie.title.toLowerCase().includes(query) ||
      movie.year.toString().includes(query) ||
      movie.cast.some(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.role.toLowerCase().includes(query)
      );
    return matchesGenre && matchesSearch;
  });

  function handleSelectMovie(movie) {
    setSelectedMovie(movie);
    setPage("detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBack() {
    setPage("home");
    setSelectedMovie(null);
  }

  return (
    <div>
      <Navbar
        page={page}
        setPage={(p) => { setPage(p); setSelectedMovie(null); }}
        search={search}
        setSearch={setSearch}
      />

      {/* ── DETAIL PAGE ── */}
      {page === "detail" && selectedMovie && (
        <MovieDetail
          movie={selectedMovie}
          onBack={handleBack}
          watchlist={watchlist}
          setWatchlist={setWatchlist}
        />
      )}

      {/* ── HOME PAGE ── */}
      {page === "home" && (
        <div className="main">
          <GenreFilter
            activeGenre={activeGenre}
            setActiveGenre={setActiveGenre}
          />
          <MovieGrid movies={filtered} onSelect={handleSelectMovie} />
        </div>
      )}

      {/* ── WATCHLIST PAGE ── */}
      {page === "watchlist" && (
        <div className="main">
          <h2 className="section-title">My Watchlist</h2>
          {watchlist.length === 0 ? (
            <div className="watchlist-empty">
              <div className="big-icon">🎬</div>
              <p>Your watchlist is empty.</p>
              <p style={{ marginTop: 8, fontSize: 14, color: "#555" }}>
                Browse movies and click "+ Add to Watchlist"
              </p>
            </div>
          ) : (
            <MovieGrid movies={watchlist} onSelect={handleSelectMovie} />
          )}
        </div>
      )}

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="logo" style={{ fontSize: 18 }}>
          CINE<span style={{ color: "#e63232" }}>PLEX</span>
        </div>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Help Center</a>
          <a href="#">API</a>
        </div>
        <div>© 2024 CINEPLEX INTERACTIVE. ALL RIGHTS RESERVED.</div>
      </footer>
    </div>
  );
}

export default App;
