import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMovieDetails } from "@/lib/getMovieDetails";

const TMDB_IMAGES_ASSET_URL = "https://image.tmdb.org/t/p/";

export default async function MoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let movie;
  try {
    movie = await getMovieDetails(id);
  } catch (error) {
    console.error("Error loading movie:", error);
  }

  if (!movie) {
    notFound();
  }

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "Unknown";

  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : "Unknown";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden">
        {movie.backdrop_path ? (
          <Image
            src={`${TMDB_IMAGES_ASSET_URL}original${movie.backdrop_path}`}
            alt=""
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

        <Link
          href="/"
          className="absolute top-6 left-6 z-10 flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/30 backdrop-blur-sm px-4 py-2 rounded-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back
        </Link>
      </div>

      <div className="container mx-auto max-w-6xl px-6 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="shrink-0 mx-auto md:mx-0">
            <div className="relative w-48 md:w-64 aspect-[2/3] rounded-lg overflow-hidden shadow-2xl">
              {movie.poster_path ? (
                <Image
                  src={`${TMDB_IMAGES_ASSET_URL}w500${movie.poster_path}`}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                  <span className="text-gray-400">No poster</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="text-lg text-white/60 italic mb-4">
                "{movie.tagline}"
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-white/70 mb-6">
              <span>{releaseYear}</span>
              <span>•</span>
              <span>{runtime}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-yellow-500"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {movie.vote_average.toFixed(1)}
              </span>
              <span className="text-white/50">
                ({movie.vote_count.toLocaleString()} votes)
              </span>
            </div>

            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-6">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-white/10 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Overview</h2>
              <p className="text-white/80 leading-relaxed max-w-3xl">
                {movie.overview || "No overview available."}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-white/50 block">Status</span>
                <span>{movie.status}</span>
              </div>
              {movie.budget > 0 && (
                <div>
                  <span className="text-white/50 block">Budget</span>
                  <span>${movie.budget.toLocaleString()}</span>
                </div>
              )}
              {movie.revenue > 0 && (
                <div>
                  <span className="text-white/50 block">Revenue</span>
                  <span>${movie.revenue.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
