const API_KEY = "4464a9cd6c3e0ee26ee5e6a893515421"; // Replace with your TMDB API key
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w440_and_h660_face"; // Adjusted for the requested image size
import {MovieCard} from "../constants/components.js"

async function fetchMovies() {
  try {
    const response = await fetch(
      `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=en-US&page=1`
    );
    const data = await response.json();

    const moviesGrid = document.querySelector(".movies_grid");
    moviesGrid.innerHTML = ""; // Clear existing content

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
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

fetchMovies();
