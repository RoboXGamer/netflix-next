import type { MovieDetails } from "@/types";
import { fetchWithRetry } from "@/lib/utils";

export async function getMovieDetails(
  movieId: string
): Promise<MovieDetails | null> {
  const token = process.env.TMDB_AUTH_TOKEN;

  if (!token) {
    throw new Error("Missing TMDB_AUTH_TOKEN environment variable");
  }

  const API_URL = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;

  try {
    const response = await fetchWithRetry(API_URL, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      next: {
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch movie details: ${response.statusText}`);
    }

    return (await response.json()) as MovieDetails;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
}
