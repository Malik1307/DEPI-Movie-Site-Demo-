const API_KEY = "4464a9cd6c3e0ee26ee5e6a893515421";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w440_and_h660_face";

let currentPage = 1; // Track the current page
const totalPages = 10; // Set a max limit (API usually supports multiple pages)

// Function to generate a Movie Card
const MovieCard = (movie, index) => `
<a href="./movie-details.html?id=${movie.id}&media_type=${movie.media_type}" class="movie-card-link">
  <div class="movie-card">
    <div class="image-container">
      <img src="${IMAGE_URL + movie.poster_path}" alt="${movie.media_type === "movie" ? movie.title : movie.name}">
      <div class="overlay"></div>
      <div class="rating"><i class="fa-solid fa-star"></i> ${movie.vote_average.toFixed(1)}</div>
    </div>
    ${index % 3 == 0 ? '<div class="top-badge">TOP 10</div>' : ""}
  </div>
  <div class="movie-title">${movie.media_type === "movie" ? movie.title : movie.name}</div>
</a>
`;

// Fetch Movies from API
async function fetchMovies(endpoint, query, pageNumber) {
  try {
    const response = await fetch(
      `${BASE_URL + endpoint}?api_key=${API_KEY + query}&language=en-US&page=${pageNumber}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

// Function to Load Movies with Pagination
async function loadMovies(page) {
  const moviesGrid = document.querySelector(".movies_grid");
  moviesGrid.innerHTML = "";
  currentPage = page;

  const data = await fetchMovies("/trending/all/week", "", currentPage);

  if (page === 1) {
    updateCarousel(data.results.slice(0, 3)); // Update carousel only on first page
  }

  data.results.forEach((movie, index) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("col-md-3", "col-sm-6", "col-lg-2", "movie_container");
    movieCard.innerHTML = MovieCard(movie, index);
    moviesGrid.appendChild(movieCard);
  });

  updatePaginationButtons();
}


// Function to Update Pagination Buttons
function updatePaginationButtons() {
  document.getElementById("prevPage").disabled = currentPage === 1;
  document.getElementById("nextPage").disabled = currentPage === totalPages;
  document.getElementById("pageNumber").textContent = `Page ${currentPage}`;

}

// Event Listeners for Pagination
document.getElementById("prevPage").addEventListener("click", () => {
  if (currentPage > 1) loadMovies(currentPage - 1);
});

document.getElementById("nextPage").addEventListener("click", () => {
  if (currentPage < totalPages) loadMovies(currentPage + 1);
});

// Initial Fetch
loadMovies(1);
