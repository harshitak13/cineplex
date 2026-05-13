const genres = ["All", "Action", "Comedy", "Drama", "Sci-Fi", "Horror", "Romance", "Thriller", "Animation"];

function GenreFilter({ activeGenre, setActiveGenre }) {
  return (
    <div>
      <h2 className="section-title">Browse by Genre</h2>
      <div className="genre-pills">
        {genres.map((genre) => (
          <button
            key={genre}
            className={`genre-pill ${activeGenre === genre ? "active" : ""}`}
            onClick={() => setActiveGenre(genre)}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
}

export default GenreFilter;
