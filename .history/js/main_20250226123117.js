const API_KEY = "4464a9cd6c3e0ee26ee5e6a893515421";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w440_and_h660_face";
const BACKDROP_PATH = "https://image.tmdb.org/t/p/original";



async function fetchMovies(endPoint, query, pageNumber) {
  try {
    const response = await fetch(
      `${
        BASE_URL + endPoint
      }?api_key=${API_KEY+query}&language=en-US&page=${pageNumber}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

async function fetchingHomePage() {
  const moviesGrid = document.querySelector(".movies_grid");
  moviesGrid.innerHTML = "";
  const data = await fetchMovies("/trending/movie/week", "", 1);

  data.results.forEach((movie, index) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add(
      "col-md-3",
      "col-sm-6",
      "col-lg-2",
      "movie_container"
    );

    movieCard.innerHTML = MovieCard(movie, index);

    moviesGrid.appendChild(movieCard);
  });
}
async function fetchingBrowseCategory() {
  const moviesGrid = document.querySelector(".movies_grid");
  moviesGrid.innerHTML = "";
  const data = await fetchMovies("/discover/tv", "&with_genres=16&sort_by=popularity.desc", 1);

  data.results.forEach((movie, index) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add(
      "col-md-3",
      "col-sm-6",
      "col-lg-2",
      "movie_container"
    );

    movieCard.innerHTML = MovieCard(movie, index,0);

    moviesGrid.appendChild(movieCard);
  });
}

fetchingBrowseCategory();
