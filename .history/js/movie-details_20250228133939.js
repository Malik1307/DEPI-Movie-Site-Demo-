const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("id");
const isMovie = urlParams.get("media_type") === "movie";

// Main initialization function
async function initMovieDetails() {
  if (movieId) {
    const movieData = await fetchMovieDetails();
    if (movieData) {
      updateMovieDetails(movieData);
    } else {
      safelySetTextContent(document.querySelector(".movie-title"), "Movie Not Found");
      safelySetTextContent(document.getElementById("description-text"), "Sorry, we couldn't load the movie details. Please try again later.");
    }
  } else {
    safelySetTextContent(document.querySelector(".movie-title"), "Movie Not Selected");
    safelySetTextContent(document.getElementById("description-text"), "Please select a movie from the homepage.");
  }

  // Initialize UI interactions
  initTabs();
}

// Run the main function when DOM is loaded
document.addEventListener("DOMContentLoaded", initMovieDetails);