export const API_KEY = "4464a9cd6c3e0ee26ee5e6a893515421";
export const BASE_URL = "https://api.themoviedb.org/3";
export const IMAGE_URL = "https://image.tmdb.org/t/p/w440_and_h660_face";
export const BACKDROP_PATH = "https://image.tmdb.org/t/p/original";
function findBestTrailer(videos) {
  if (!videos || videos.length === 0) return null;

  // Filter for YouTube trailers
  const trailers = videos.filter(
    video => video.site === "YouTube" && video.type === "Trailer"
  );

  // Return the first trailer (or null if none exist)
  return trailers.length > 0 ? trailers[0] : null;
}
