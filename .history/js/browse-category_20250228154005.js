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

// Store selected genres
let selectedGenres = [];

async function fetchingBrowseCategory(filters = {}) {
  const mediaType = category == "anime" ? "tv" : category;
  let queryParams = category == "anime" ? "&with_genres=16" : "";
  
  // Add filter parameters if provided
  if (filters.genres) {
    queryParams += `&with_genres=${filters.genres}`;
  }
  
  if (filters.sort_by) {
    queryParams += `&sort_by=${filters.sort_by}`;
  }
  
  if (filters['primary_release_date.gte']) {
    const dateParam = mediaType === 'movie' ? 'primary_release_date.gte' : 'first_air_date.gte';
    queryParams += `&${dateParam}=${filters['primary_release_date.gte']}`;
  }
  
  if (filters['primary_release_date.lte']) {
    const dateParam = mediaType === 'movie' ? 'primary_release_date.lte' : 'first_air_date.lte';
    queryParams += `&${dateParam}=${filters['primary_release_date.lte']}`;
  }

  const moviesGrid = document.querySelector(".movies_grid");
  moviesGrid.innerHTML = "";
  
  try {
  try {
    const data = await fetchMovies(`/discover/${mediaType}`, queryParams, 1);
    console.log("Fetched data:", data);
} catch (error) {
    console.error("Error fetching movies:", error);
}


    if (data && data.results) {
      data.results.forEach((movie, index) => {
        const movieCard = document.createElement("div");
        movieCard.classList.add(
          "col-md-3",
          "col-sm-6",
          "col-lg-2",
          "movie-container"
        );

        movieCard.innerHTML = categoryCard(movie, index);
        moviesGrid.appendChild(movieCard);
      });
    }
  } catch (error) {
    console.error("Error fetching movies:", error);
    const moviesGrid = document.querySelector(".movies_grid");
    moviesGrid.innerHTML = '<div class="alert alert-danger w-100">Error loading content. Please try again later.</div>';
  }
}

// Initialize custom genre selector
function initGenreSelector() {
  const genreContainer = document.getElementById("genreSelectContainer");
  const genreDisplay = document.getElementById("genreDisplay");
  const genreOptions = document.getElementById("genreOptions");
  const selectedGenresInput = document.getElementById("selectedGenres");
  
  // Clear options first to avoid duplicates
  genreOptions.innerHTML = '';
  
  // Populate genre options
  genres.forEach((genre) => {
    const option = document.createElement("div");
    option.classList.add("custom-select-option");
    option.dataset.value = genre.id;
    option.textContent = genre.name;

    option.addEventListener("click", function() {
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

  // Toggle dropdown on click
  genreDisplay.addEventListener("click", function(e) {
    e.stopPropagation();
    genreContainer.classList.toggle("open");
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", function() {
    genreContainer.classList.remove("open");
  });

  // Prevent click inside dropdown from closing it
  genreOptions.addEventListener("click", function(e) {
    e.stopPropagation();
  });
}

// Update genre display text
function updateGenreDisplay() {
  const genreDisplay = document.getElementById("genreDisplay");
  const selectedGenresInput = document.getElementById("selectedGenres");
  
  if (selectedGenres.length === 0) {
    genreDisplay.textContent = "Select genres";
  } else {
    // Get names of selected genres
    const names = selectedGenres
      .map((id) => {
        const genre = genres.find(
          (g) => g.id.toString() === id.toString()
        );
        return genre ? genre.name : "";
      })
      .filter((name) => name !== "");

    genreDisplay.textContent = names.join(", ");
  }

  // Update hidden input
  selectedGenresInput.value = selectedGenres.join(",");
}

// Setup filter controls
function setupFilterControls() {
  // Reset filters button
  const resetFiltersBtn = document.getElementById("resetFilters");
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener("click", function() {
      // Reset genre selection
      selectedGenres = [];
      document
        .querySelectorAll(".custom-select-option")
        .forEach((option) => {
          option.classList.remove("selected");
        });
      updateGenreDisplay();

      // Reset other filters
      document.getElementById("sortSelect").selectedIndex = 0;
      document.getElementById("yearFrom").value = "";
      document.getElementById("yearTo").value = "";
      
      // Reload the default content
      fetchingBrowseCategory();
    });
  }

  // Apply filters button
  const applyFiltersBtn = document.getElementById("applyFilters");
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener("click", function() {
      // Collect all filter values
      const sortBy = document.getElementById("sortSelect").value;
      const yearFrom = document.getElementById("yearFrom").value;
      const yearTo = document.getElementById("yearTo").value;
      const selectedGenresValue = document.getElementById("selectedGenres").value;

      // Build filter object to pass to API function
      const filters = {
        genres: selectedGenresValue,
        sort_by: sortBy,
        "primary_release_date.gte": yearFrom ? `${yearFrom}-01-01` : "",
        "primary_release_date.lte": yearTo ? `${yearTo}-12-31` : "",
      };

      console.log("Applied filters:", filters);
      fetchingBrowseCategory(filters);
    });
  }

  // Collapse functionality with icon rotation
  const collapseBtn = document.getElementById("collapseBtn");
  if (collapseBtn) {
    collapseBtn.addEventListener("click", function() {
      this.classList.toggle("collapsed");
    });
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
  // Set up genre selector
  initGenreSelector();
  
  // Set up filter buttons and collapse functionality
  setupFilterControls();
  
  // Initial load of content
  fetchingBrowseCategory();
});