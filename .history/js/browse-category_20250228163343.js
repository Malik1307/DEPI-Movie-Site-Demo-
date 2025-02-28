

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("navbar-container").innerHTML = getNavBar(); // Make sure the page has <div id="nav-container"></div>

  // Now select buttons after navbar is added
  const signUpBtn = document.querySelector("#sign-up");
  const logOutBtn = document.querySelector("#log-out");
  logOutBtn.addEventListener("click", logOut);

  if (localStorage.getItem("user") !== null) {
    signUpBtn.style.display = "none";
    console.log("User is logged in, hiding Sign Up button.");
  } else {
    logOutBtn.style.display = "none";
    console.log("User is logged out, hiding Logout button.");
  }
});
const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get("category");

const genres = [
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

let selectedGenres = [];

async function fetchingBrowseCategory(filters = {}) {
  const mediaType = category === "anime" ? "tv" : category;
  let queryParams = "";

  if (category === "anime") {
    if (filters.genres && filters.genres.length > 0) {
      const genreList = filters.genres.split(",");
      if (!genreList.includes("16")) {
        genreList.push("16");
      }
      queryParams += `&with_genres=${genreList.join(",")}`;
    } else {
      queryParams += "&with_genres=16"; // Only Animation genre if no other genres selected
    }
  } else if (filters.genres && filters.genres.length > 0) {
    // For other media types, just use the selected genres
    queryParams += `&with_genres=${filters.genres}`;
  }
  
  if (filters.sort_by) queryParams += `&sort_by=${filters.sort_by}`;
  
  if (filters["primary_release_date.gte"]) {
    const dateParam = mediaType === "movie" ? "primary_release_date.gte" : "first_air_date.gte";
    queryParams += `&${dateParam}=${filters["primary_release_date.gte"]}`;
  }

  if (filters["primary_release_date.lte"]) {
    const dateParam = mediaType === "movie" ? "primary_release_date.lte" : "first_air_date.lte";
    queryParams += `&${dateParam}=${filters["primary_release_date.lte"]}`;
  }

  console.log("Fetching movies with:", `/discover/${mediaType}`, queryParams);

  const moviesGrid = document.querySelector(".movies_grid");
  moviesGrid.innerHTML = "";

  try {
    const data = await fetchMovies(`/discover/${mediaType}`, queryParams, 1);

    if (!data || !data.results) {
      console.error("API Response Error:", data);
      throw new Error("Invalid response from API");
    }

    data.results.forEach((movie, index) => {
      const movieCard = document.createElement("div");
      movieCard.classList.add("col-md-3", "col-sm-6", "col-lg-2", "movie-container");
      movieCard.innerHTML = categoryCard(movie, index);
      moviesGrid.appendChild(movieCard);
    });
  } catch (error) {
    console.error("Error fetching movies:", error);
    moviesGrid.innerHTML = `<div class="alert alert-danger w-100">Error loading content. Please try again later.</div>`;
  }
}

// Initialize genre selection UI
function initGenreSelector() {
  const genreOptions = document.getElementById("genreOptions");
  genreOptions.innerHTML = '';

  genres.forEach((genre) => {
    const option = document.createElement("div");
    option.classList.add("custom-select-option");
    option.dataset.value = genre.id;
    option.textContent = genre.name;
    option.addEventListener("click", function () {
      const value = this.dataset.value;
      const index = selectedGenres.indexOf(value);
      if (index === -1) {
        selectedGenres.push(value);
        this.classList.add("selected");
      } else {
        selectedGenres.splice(index, 1);
        this.classList.remove("selected");
      }
      updateGenreDisplay();
    });
    genreOptions.appendChild(option);
  });
}

function updateGenreDisplay() {
  const genreDisplay = document.getElementById("genreDisplay");
  const names = selectedGenres
    .map((id) => genres.find((g) => g.id.toString() === id.toString())?.name)
    .filter(Boolean);
  genreDisplay.textContent = names.length ? names.join(", ") : "Select genres";
}

// Setup filter controls
function setupFilterControls() {
  document.getElementById("resetFilters").addEventListener("click", () => {
    selectedGenres = [];
    document.querySelectorAll(".custom-select-option").forEach(option => option.classList.remove("selected"));
    updateGenreDisplay();
    document.getElementById("sortSelect").selectedIndex = 0;
    document.getElementById("yearFrom").value = "";
    document.getElementById("yearTo").value = "";
    fetchingBrowseCategory();
  });

  document.getElementById("applyFilters").addEventListener("click", () => {
    const filters = {
      genres: selectedGenres.join(","),
      sort_by: document.getElementById("sortSelect").value,
      "primary_release_date.gte": document.getElementById("yearFrom").value ? `${document.getElementById("yearFrom").value}-01-01` : "",
      "primary_release_date.lte": document.getElementById("yearTo").value ? `${document.getElementById("yearTo").value}-12-31` : "",
    };
    fetchingBrowseCategory(filters);
  });
}

function setupCustomSelect() {
  const genreDisplay = document.getElementById("genreDisplay");
  const selectContainer = document.getElementById("genreSelectContainer");
  
  // Toggle the dropdown when clicking on the display element
  genreDisplay.addEventListener("click", function(e) {
    e.stopPropagation();
    selectContainer.classList.toggle("open");
  });
  
  // Close dropdown when clicking outside
  document.addEventListener("click", function(e) {
    if (!selectContainer.contains(e.target)) {
      selectContainer.classList.remove("open");
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  initGenreSelector();
  setupFilterControls();
  setupCustomSelect();
  fetchingBrowseCategory();
});