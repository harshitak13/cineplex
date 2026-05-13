import { useState, useEffect } from "react";
import { fetchActorMovies, IMG } from "../data/tmdb";
import MovieCard from "./MovieCard";

function ActorPage({ actor, onBack, onSelectMovie }) {
  const [person, setPerson] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchActorMovies(actor.id);
      setPerson(data.person);
      // Sort by popularity, filter out items without posters
      const sorted = (data.credits?.cast || [])
        .filter((m) => m.poster_path)
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 20);
      setMovies(sorted);
      setLoading(false);
    }
    load();
  }, [actor.id]);

  const photo = actor.profile_path
    ? `${IMG}${actor.profile_path}`
    : "https://via.placeholder.com/200x300?text=No+Photo";

  return (
    <div>
      <button className="back-btn" onClick={onBack}>← Back to Movie</button>

      {loading ? (
        <div className="loading" style={{ padding: "60px 40px" }}>
          <div className="spinner"></div>
          <p>Loading filmography...</p>
        </div>
      ) : (
        <div className="main">
          {/* Actor Header */}
          <div className="actor-header">
            <img className="actor-photo" src={photo} alt={actor.name} />
            <div className="actor-info">
              <h1 className="actor-name">{person?.name || actor.name}</h1>
              {person?.birthday && (
                <p className="actor-meta">
                  🎂 Born: {new Date(person.birthday).toLocaleDateString("en-US", {
                    year: "numeric", month: "long", day: "numeric"
                  })}
                  {person.place_of_birth && ` — ${person.place_of_birth}`}
                </p>
              )}
              {person?.known_for_department && (
                <p className="actor-meta">🎭 Known for: {person.known_for_department}</p>
              )}
              {person?.biography && (
                <p className="actor-bio">
                  {person.biography.length > 600
                    ? person.biography.slice(0, 600) + "..."
                    : person.biography}
                </p>
              )}
            </div>
          </div>

          {/* Filmography */}
          <h2 className="section-title" style={{ marginTop: 48, marginBottom: 24 }}>
            Filmography
          </h2>
          <div className="movie-grid">
            {movies.map((m) => (
              <MovieCard key={m.id} movie={m} onClick={onSelectMovie} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ActorPage;
