const signUpBtn = document.querySelector("#sign-up");
const logOutBtn = document.querySelector("#log-out");

if (localStorage.getItem("user") !== null) {
  signUpBtn.style.display = "none";
} else {
  logOutBtn.style.display = "none";
}

// Load Movies
async function loadMovies(page) {
  const moviesGrid = document.querySelector(".movies-grid");
  moviesGrid.innerHTML = "";
  currentPage = page;

  const data = await fetchMovies("/trending/all/week", "", currentPage);

  data.results.forEach((movie, index) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("col-md-3", "col-sm-6", "col-lg-2", "movie-container");
    movieCard.innerHTML = MovieCard(movie, index, true);
    moviesGrid.appendChild(movieCard);
  });

  updatePaginationButtons();
}

// Update Pagination Buttons
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

// Log Out Function
function logOut() {
  if (confirm("Are you sure you want to log out?")) {
    localStorage.removeItem("user");
    window.location.href = "../screens/index.html";
  }
}

logOutBtn.addEventListener("click", logOut);

// Initial Fetch
loadMovies(1);