import type { TMDBResponse, Movie } from "@/types";

const API_URL =
  "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc";

export async function getPopularMovies(): Promise<Movie[]> {
  let token = process.env.TMDB_AUTH_TOKEN;
  // token = "t";
  // console.log({ token });
  if (!token) {
    throw new Error("Missing TMDB_AUTH_TOKEN environment variable");
  }
  const response = await fetch(API_URL, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  console.log({ status: response.status });
  if (!response.ok) {
    throw new Error(`Failed to fetch movies: ${response.statusText}`);
  }

  const data = (await response.json()) as TMDBResponse;
  return data.results;
}
