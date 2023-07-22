import { useEffect, useState } from "react";

const KEY = "6d104b8";
export function useMovies(query, callBack) {
  const [isLoading, setIsLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  useEffect(
    function () {
      callBack?.();
      const controller = new AbortController();
      const fetchMovies = async () => {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&S=${query}`,
            { signal: controller.signal }
          );
          if (!res.ok)
            throw new Error("something went wrong with fetching movies");
          const data = await res.json();
          if (data.Response === "False") throw new Error("movie not found");
          setMovies(data.Search);
          setIsLoading(false);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      // handleCloseMovieDetail();
      fetchMovies();
      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return { isLoading, movies, error };
}
