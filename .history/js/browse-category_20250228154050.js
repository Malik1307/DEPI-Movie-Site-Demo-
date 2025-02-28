// Constants file (constants.js)
const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = "your_api_key_here";

async function fetchMovies(endPoint, query, pageNumber) {
  try {
    const response = await fetch(
      `${BASE_URL}${endPoint}?api_key=${API_KEY}&language=en-US${query}&page=${pageNumber}`
    );
    const data = await response.json();
    if (!data || data.success === false) {
      throw new Error(data.status_message || "Invalid response from API");
    }
    return data;
  } catch (error) {
    console.error("Error fetching movies:", error);
    return null;
  }
}

// Browse Category File (browse-category.js)
async function fetchingBrowseCategory(category, pageNumber = 1) {
  let endPoint = "";
  let query = "";

  switch (category) {
    case "movies":
      endPoint = "/discover/movie";
      query = "&sort_by=popularity.desc";
      break;
    case "tv":
      endPoint = "/discover/tv";
      query = "&sort_by=popularity.desc";
      break;
    case "anime":
      endPoint = "/discover/tv";
      query = "&with_genres=16&with_original_language=ja&sort_by=popularity.desc";
      break;
    default:
      console.error("Invalid category specified");
      return;
  }

  const data = await fetchMovies(endPoint, query, pageNumber);
  if (!data || !data.results) {
    console.error("No data returned for category:", category);
    return;
  }

  renderMovies(data.results);
}

function renderMovies(movies) {
  const container = document.getElementById("movies-container");
  container.innerHTML = "";

  if (!movies.length) {
    container.innerHTML = "<p>No results found.</p>";
    return;
  }

  movies.forEach((movie) => {
    const movieElement = document.createElement("div");
    movieElement.classList.add("movie-item");
    movieElement.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title || movie.name}" />
      <h3>${movie.title || movie.name}</h3>
    `;
    container.appendChild(movieElement);
  });
}

// Example Usage
document.addEventListener("DOMContentLoaded", () => {
  fetchingBrowseCategory("movies"); // Default to movies
});
