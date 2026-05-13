import { useState, useEffect, useCallback, useRef } from "react";
import "./App.css";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { useAuth } from "./context/AuthContext";
import { fetchTrending, fetchByGenre, searchMovies, GENRE_MAP } from "./data/tmdb";
import AuthPage from "./components/AuthPage";
import Navbar from "./components/Navbar";
import GenreFilter from "./components/GenreFilter";
import MovieGrid from "./components/MovieGrid";
import MovieDetail from "./components/MovieDetail";
import ActorPage from "./components/ActorPage";
import UserProfile from "./components/UserProfile";

function App() {
  const { user, authLoading } = useAuth();

  const [page, setPage] = useState("home");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedActor, setSelectedActor] = useState(null);
  const [activeGenre, setActiveGenre] = useState("All");
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [watchlist, setWatchlist] = useState([]);
  const [watchlistLoaded, setWatchlistLoaded] = useState(false);

  // Load watchlist from Firestore when user logs in
  useEffect(() => {
    if (!user) {
      setWatchlist([]);
      setWatchlistLoaded(false);
      return;
    }
    async function loadWatchlist() {
      const ref = doc(db, "watchlists", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setWatchlist(snap.data().movies || []);
      } else {
        setWatchlist([]);
      }
      setWatchlistLoaded(true);
    }
    loadWatchlist();
  }, [user]);

  // Save watchlist to Firestore whenever it changes
  useEffect(() => {
    if (!user || !watchlistLoaded) return;
    const ref = doc(db, "watchlists", user.uid);
    setDoc(ref, { movies: watchlist });
  }, [watchlist, user, watchlistLoaded]);

  // Fetch movies
  const fetchMovies = useCallback(async (genre, query, pg = 1) => {
    if (pg === 1) setLoading(true);
    else setLoadingMore(true);
    try {
      let data;
      if (query.trim().length > 0) {
        data = await searchMovies(query, pg);
      } else if (genre === "All") {
        data = await fetchTrending(pg);
      } else {
        data = await fetchByGenre(GENRE_MAP[genre], pg);
      }
      if (pg === 1) setMovies(data.results);
      else setMovies((prev) => [...prev, ...data.results]);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Fetch error:", err);
    }
    if (pg === 1) setLoading(false);
    else setLoadingMore(false);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    const timer = setTimeout(() => fetchMovies(activeGenre, search, 1), 400);
    return () => clearTimeout(timer);
  }, [search, activeGenre, fetchMovies]);

  // Infinite scroll
  const sentinelRef = useRef(null);
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && currentPage < totalPages) {
          const next = currentPage + 1;
          setCurrentPage(next);
          fetchMovies(activeGenre, search, next);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [sentinelRef, loadingMore, currentPage, totalPages, activeGenre, search, fetchMovies]);

  function handleSelectMovie(movie) {
    setSelectedMovie(movie);
    setPage("detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSelectActor(actor) {
    setSelectedActor(actor);
    setPage("actor");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBack() {
    if (page === "actor") { setPage("detail"); setSelectedActor(null); }
    else { setPage("home"); setSelectedMovie(null); }
  }

  function handleSetPage(nextPage) {
    setPage(nextPage);
    setSelectedMovie(null);
    setSelectedActor(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Show spinner while checking auth
  if (authLoading) {
    return (
      <div style={{ background: "#0a0a0a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="spinner"></div>
      </div>
    );
  }

  // Show auth page if not logged in
  if (!user) return <AuthPage />;

  return (
    <div>
      <Navbar
        page={page}
        setPage={handleSetPage}
        search={search}
        setSearch={setSearch}
        watchlistCount={watchlist.length}
      />

      {page === "detail" && selectedMovie && (
        <MovieDetail
          movie={selectedMovie}
          onBack={handleBack}
          watchlist={watchlist}
          setWatchlist={setWatchlist}
          onSelectMovie={handleSelectMovie}
          onSelectActor={handleSelectActor}
        />
      )}

      {page === "actor" && selectedActor && (
        <ActorPage actor={selectedActor} onBack={handleBack} onSelectMovie={handleSelectMovie} />
      )}

      {page === "profile" && (
        <UserProfile watchlistCount={watchlist.length} />
      )}

      {page === "home" && (
        <div className="main">
          <GenreFilter activeGenre={activeGenre} setActiveGenre={setActiveGenre} />
          {loading ? (
            <div className="loading"><div className="spinner"></div><p>Loading movies...</p></div>
          ) : (
            <>
              <MovieGrid movies={movies} onSelect={handleSelectMovie} />
              <div ref={sentinelRef} style={{ height: 40 }} />
              {loadingMore && (
                <div className="loading"><div className="spinner"></div><p>Loading more...</p></div>
              )}
            </>
          )}
        </div>
      )}

      {page === "watchlist" && (
        <div className="main">
          <h2 className="section-title">My Watchlist</h2>
          {watchlist.length === 0 ? (
            <div className="watchlist-empty">
              <div className="big-icon">🎬</div>
              <p>Your watchlist is empty.</p>
              <p style={{ marginTop: 8, fontSize: 14, color: "#555" }}>Browse movies and click "+ Add to Watchlist"</p>
            </div>
          ) : (
            <MovieGrid movies={watchlist} onSelect={handleSelectMovie} />
          )}
        </div>
      )}

      <footer className="footer">
        <div className="logo" style={{ fontSize: 18 }}>CINE<span style={{ color: "#e63232" }}>PLEX</span></div>
        <div className="footer-links">
          <a href="/privacy-policy">Privacy Policy</a>
          <a href="/terms-of-service">Terms of Service</a>
          <a href="/help-center">Help Center</a>
          <a href="/api">API</a>
        </div>
        <div>© 2024 CINEPLEX INTERACTIVE. ALL RIGHTS RESERVED.</div>
      </footer>
    </div>
  );
}

export default App;
