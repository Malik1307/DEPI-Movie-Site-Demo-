
const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get("category");

const categoryCard = (movie, index) => ` 
<a href="./movie-details.html?id=${movie.id}&media_type=${
  category != "movie" ? "tv" : "movie"
}" class="movie-card-link">
<div class="movie-card">
    <div class="image-container">
        <img src="${IMAGE_URL + movie.poster_path}" alt="${
  category != "movie" ? movie.name : movie.title
}">
        <div class="overlay"></div>
        <div class="rating"><i class="fa-solid fa-star"></i> ${movie.vote_average.toFixed(
          1
        )}</div>
    </div>
    ${
      index % 3 == 0 ? '<div class="top-badge">TOP 10</div>' : ""
    } <!-- Show TOP 10 only for the first 10 movies -->
</div>
<div class="movie-title">${category != "movie" ? movie.name : movie.title}</div>
</a>  
`;

async function fetchMovies(endPoint, query, pageNumber) {
  try {
    const response = await fetch(
      `${BASE_URL + endPoint}?api_key=${
        API_KEY + query
      }&language=en-US&page=${pageNumber}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

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
  
  const data = await fetchMovies(
    `/discover/${mediaType}`,
    queryParams,
    1
  );

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
}

// Initial load
fetchingBrowseCategory();

// Connect the apply filters button when document is loaded
document.addEventListener('DOMContentLoaded', function() {
  const applyFiltersBtn = document.getElementById('applyFilters');
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', function() {
      // Collect all filter values
      const sortBy = document.getElementById('sortSelect').value;
      const yearFrom = document.getElementById('yearFrom').value;
      const yearTo = document.getElementById('yearTo').value;
      const selectedGenres = document.getElementById('selectedGenres').value;
      
      // Build filter object
      const filters = {
        genres: selectedGenres,
        sort_by: sortBy,
        'primary_release_date.gte': yearFrom ? `${yearFrom}-01-01` : '',
        'primary_release_date.lte': yearTo ? `${yearTo}-12-31` : ''
      };
      
      console.log('Applied filters:', filters);
      fetchingBrowseCategory(filters);
    });
  }
  
  // Connect reset filters button
  const resetFiltersBtn = document.getElementById('resetFilters');
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', function() {
      // After the existing reset logic, reload the content
      fetchingBrowseCategory();
    });
  }
});