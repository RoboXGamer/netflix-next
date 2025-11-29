import Hero from "@/components/Hero";
import TrendingNow from "@/components/TrendingNow";
import { getPopularMovies } from "@/lib/api";

export default async function Home() {
  let movies;

  try {
    movies = await getPopularMovies();
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching popular movies:", error);
    }
  }

  return (
    <main>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <Hero />
        <div className="container mx-auto mt-6 max-w-6xl px-6">
          <TrendingNow movies={movies} />
        </div>
      </div>
    </main>
  );
}
