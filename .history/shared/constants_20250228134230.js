// API Constants
const API_KEY = "4464a9cd6c3e0ee26ee5e6a893515421";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w440_and_h660_face";
const BACKDROP_PATH = "https://image.tmdb.org/t/p/original";

// Genre Lists
const movieGenres = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

const tvGenres = [
  { id: 10759, name: "Action & Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 10762, name: "Kids" },
  { id: 9648, name: "Mystery" },
  { id: 10763, name: "News" },
  { id: 10764, name: "Reality" },
  { id: 10765, name: "Sci-Fi & Fantasy" },
  { id: 10766, name: "Soap" },
  { id: 10767, name: "Talk" },
  { id: 10768, name: "War & Politics" },
  { id: 37, name: "Western" },
];

// Utility Functions
const getGenreNames = (genreIds, mediaType) => {
  if (!genreIds || genreIds.length === 0) return [];
  const genres = mediaType === "movie" ? movieGenres : tvGenres;
  return genreIds
    .map((id) => {
      const genre = genres.find((g) => g.id === id);
      return genre ? genre.name : null;
    })
    .filter((name) => name !== null);
};

const safelySetTextContent = (element, text) => {
  if (element) {
    element.textContent = text;
  } else {
    console.warn(`Element not found for setting text: ${text}`);
  }
};

const safelySetStyle = (element, property, value) => {
  if (element) {
    element.style[property] = value;
  } else {
    console.warn(`Element not found for setting style: ${property}:${value}`);
  }
};

const findBestTrailer = (videos) => {
  return videos.find((video) => video.type === "Trailer" && video.site === "YouTube");
};

// API Endpoints
const MOVIE_DETAILS_ENDPOINT = `${BASE_URL}/movie/{id}?api_key=${API_KEY}&append_to_response=credits,recommendations,videos,reviews`;
const TV_DETAILS_ENDPOINT = `${BASE_URL}/tv/{id}?api_key=${API_KEY}&append_to_response=credits,recommendations,videos,reviews`;
const ACTOR_DETAILS_ENDPOINT = `${BASE_URL}/person/{id}?api_key=${API_KEY}&append_to_response=movie_credits`;

// Placeholder Images
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/300x450";
const PLACEHOLDER_BACKDROP = "https://via.placeholder.com/1200x600";

// Pagination
let currentPage = 1;
const totalPages = 10;

// Fetch Movies Utility
async function fetchMovies(endPoint, query, pageNumber) {
  try {
    const response = await fetch(
      `${BASE_URL + endPoint}?api_key=${API_KEY + query}&language=en-US&page=${pageNumber}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}