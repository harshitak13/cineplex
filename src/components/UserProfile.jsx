import { useAuth } from "../context/AuthContext";

function UserProfile({ watchlistCount = 0 }) {
  const { user } = useAuth();
  const displayName = user?.displayName || "CinePlex User";
  const email = user?.email || "No email available";
  const joinedDate = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  return (
    <main className="profile-page">
      <section className="profile-hero">
        <div className="profile-avatar-large">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="profile-kicker">Profile</p>
          <h1 className="profile-name">{displayName}</h1>
          <p className="profile-email">{email}</p>
        </div>
      </section>

      <section className="profile-grid">
        <div className="profile-panel">
          <h2>Account Details</h2>
          <div className="profile-detail-row">
            <span>Name</span>
            <strong>{displayName}</strong>
          </div>
          <div className="profile-detail-row">
            <span>Email</span>
            <strong>{email}</strong>
          </div>
          <div className="profile-detail-row">
            <span>Joined</span>
            <strong>{joinedDate}</strong>
          </div>
        </div>

        <div className="profile-panel">
          <h2>Library</h2>
          <div className="profile-stat">
            <span>{watchlistCount}</span>
            <p>{watchlistCount === 1 ? "movie" : "movies"} in watchlist</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default UserProfile;
