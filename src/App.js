// import { toHaveFormValues } from "@testing-library/jest-dom/dist/matchers";
import { useEffect } from "react";
import { useRef } from "react";
// import { Children } from "react";
import { useState } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";

// OMDb API KEY:6d104b8

// Please append it to all of your API requests,

// OMDb API: http://www.omdbapi.com/?i=tt3896198&apikey=6d104b8

const getLocalStorage = () => {
  const storedValue = localStorage.getItem("watched");
  if (storedValue) {
    return JSON.parse(storedValue);
  } else {
    return [];
  }
};
const KEY = "6d104b8";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [watched, setWatched] = useState(getLocalStorage);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const { isLoading, movies, error } = useMovies(query, handleCloseMovieDetail);
  const handleSelectedMovie = (id) => {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  };
  function handleCloseMovieDetail() {
    setSelectedId(null);
  }
  const handleWathedMovies = (movie) => {
    setWatched((watched) => [...watched, movie]);
  };
  const handleDeleteWatched = (id) => {
    setWatched((movies) => movies.filter((movie) => movie.imdbID !== id));
  };
  useEffect(() => {
    localStorage.setItem("watched", JSON.stringify(watched));
  }, [watched]);

  return (
    <>
      <Navbar>
        <Logo></Logo>
        <SearchInput query={query} setQuery={setQuery}></SearchInput>
        <NumResult movies={movies}></NumResult>
      </Navbar>
      <Main>
        <Box>
          {isLoading ? (
            <Loader></Loader>
          ) : error ? (
            <ErrorMessage message={error}></ErrorMessage>
          ) : (
            <MovieList
              movies={movies}
              handleSelectedMovie={handleSelectedMovie}
            ></MovieList>
          )}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              handleCloseMovieDetail={handleCloseMovieDetail}
              handleWathedMovies={handleWathedMovies}
              watched={watched}
            ></MovieDetails>
          ) : (
            <>
              <WatchedSummary watched={watched}></WatchedSummary>
              <WatchedMovieList
                watched={watched}
                handleDeleteWatched={handleDeleteWatched}
              ></WatchedMovieList>
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
// navbar start ---------------------------------------------------
const Loader = () => {
  return <p className="loader">Loading...</p>;
};
const ErrorMessage = ({ message }) => {
  return (
    <p className="error">
      <span>💣</span>

      {message}
    </p>
  );
};
function Navbar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function SearchInput({ query, setQuery }) {
  const inputEl = useRef(null);
  useEffect(() => {
    const callBack = (e) => {
      if (document.activeElement === inputEl.current) return;
      if (e.code === "Enter") {
        inputEl.current.focus();
        setQuery("");
      }
    };

    document.addEventListener("keydown", callBack);
    return () => document.removeEventListener("keydown", callBack);
  }, [setQuery]);
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}
function NumResult({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

// navbar end---------------------------------------------------

// main booard---------------------------------------------------
function Main({ children }) {
  return <main className="main">{children}</main>;
}

// main board------------------reusable  box---------------------------------start
function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}
function MovieList({ movies, handleSelectedMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          key={movie.imdbID}
          movie={movie}
          handleSelectedMovie={handleSelectedMovie}
        ></Movie>
      ))}
    </ul>
  );
}
function Movie({ movie, handleSelectedMovie }) {
  return (
    <li onClick={() => handleSelectedMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
// main board------------------reusable  box---------------------------------end

// function RightWatchedBox() {
//   const [watched, setWatched] = useState(tempWatchedData);
//   const [isOpen2, setIsOpen2] = useState(true);

//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && (
//         <>
//           <WatchedSummary watched={watched}></WatchedSummary>

//           <WatchedMovieList watched={watched}></WatchedMovieList>
//         </>
//       )}
//     </div>
//   );
// }

const MovieDetails = ({
  selectedId,
  handleCloseMovieDetail,
  handleWathedMovies,
  watched,
}) => {
  const [detailMovie, setDetailMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");
  const countRef = useRef(0);
  useEffect(() => {
    if (userRating) countRef.current++;
  }, [userRating]);

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actor: actor,
    Director: director,
    Genre: genre,
  } = detailMovie;
  const handleAddtoWatched = () => {
    const newWatchedMovie = {
      userRating,
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split("").at(0)),
      countRatingDecisions: countRef.current,
    };

    handleWathedMovies(newWatchedMovie);
    handleCloseMovieDetail();
  };
  // two import Array method 1.includes,2.find

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  // very important method: optional chaning, if no id matched return undefine avoid TYPE Error
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;
  useEffect(() => {
    function escapeCallBack(e) {
      if (e.code === "Escape") {
        handleCloseMovieDetail();
      }
    }
    document.addEventListener("keydown", escapeCallBack);
    return function () {
      document.removeEventListener("keydown", escapeCallBack);
    };
  }, [handleCloseMovieDetail]);

  useEffect(() => {
    const getMovieDetails = async () => {
      setIsLoading(true);
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
      );
      const data = await res.json();
      setDetailMovie(data);
      setIsLoading(false);
    };
    getMovieDetails();
  }, [selectedId]);
  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title}`;
    return function () {
      document.title = "useEffect Popcorn";
    };
  }, [title]);

  return (
    <div className="details">
      {isLoading ? (
        <Loader></Loader>
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={handleCloseMovieDetail}>
              &larr;
            </button>
            <img src={poster} alt={title} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull;{runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {isWatched ? (
                <p>
                  You rated this movie <em> {watchedUserRating}</em>{" "}
                  <span>⭐️</span>
                </p>
              ) : (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  ></StarRating>

                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAddtoWatched}>
                      + Add to list
                    </button>
                  )}
                </>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>starring {actor}</p>
            <p>directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
};
function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}
function WatchedMovieList({ watched, handleDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          handleDeleteWatched={handleDeleteWatched}
        ></WatchedMovie>
      ))}
    </ul>
  );
}
function WatchedMovie({ movie, handleDeleteWatched }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          {/* key={movie.imdbID} */}
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => handleDeleteWatched(movie.imdbID)}
        >
          X
        </button>
      </div>
    </li>
  );
}
