import { useAuth } from "../context/AuthContext";

function Navbar({ page, setPage, search, setSearch, watchlistCount }) {
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
  }

  return (
    <nav className="navbar">
      <div className="logo">
        CINE<span>PLEX</span>
      </div>
      <div className="nav-links">
        <button
          className={page === "home" ? "active" : ""}
          onClick={() => setPage("home")}
        >
          Home
        </button>
        <button
          className={page === "watchlist" ? "active" : ""}
          onClick={() => setPage("watchlist")}
        >
          Watchlist
          {watchlistCount > 0 && (
            <span className="watchlist-badge">{watchlistCount}</span>
          )}
        </button>
      </div>
      <div className="nav-right">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search movies, actors, directors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* User dropdown */}
        <div className="user-menu">
          <div className="user-avatar">
            {user?.displayName ? user.displayName[0].toUpperCase() : "👤"}
          </div>
          <div className="user-dropdown">
            <div className="user-dropdown-name">
              {user?.displayName || user?.email}
            </div>
            <div className="user-dropdown-email">{user?.email}</div>
            <hr className="dropdown-divider" />
            <button className="dropdown-logout" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
