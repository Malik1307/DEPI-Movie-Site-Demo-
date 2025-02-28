// API Constants
const API_KEY = "4464a9cd6c3e0ee26ee5e6a893515421";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w440_and_h660_face";
const BACKDROP_PATH = "https://image.tmdb.org/t/p/original";

// Get movie ID from URL
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("id");

console.log("Movie ID:", movieId);

// Function to fetch movie details
async function fetchMovieDetails() {
  try {
    const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,recommendations`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch movie details');
    }
    
    const data = await response.json();
    console.log("Movie data fetched:", data);
    return data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
}

// Function to update UI with movie details
function updateMovieDetails(movie) {
  if (!movie) {
    console.error("No movie data available to update UI");
    return;
  }
  
  // Get all elements
  const movieTitle = document.querySelector('.movie-title');
  const movieRating = document.querySelector('.movie-rating .fw-bold');
  const movieYear = document.querySelector('.movie-info span:nth-child(2)');
  const movieDuration = document.querySelector('.movie-info span:nth-child(3)');
  const movieTags = document.querySelector('.movie-tags');
  const directorInfo = document.querySelector('.movie-meta:nth-of-type(1) span:nth-child(2)');
  const castInfo = document.querySelector('.movie-meta:nth-of-type(2) span:nth-child(2)');
  const descriptionText = document.getElementById('description-text');
  const moviePoster = document.querySelector('.movie-poster');
  const movieBackdrop = document.querySelector('.movie-backdrop');
  const castGrid = document.querySelector('.cast-grid');
  const recommendedContent = document.getElementById('recommended');
  
  // Update basic info
  movieTitle.textContent = movie.title;
  movieRating.textContent = movie.vote_average.toFixed(1);
  movieYear.textContent = new Date(movie.release_date).getFullYear();
  
  // Format runtime to hours and minutes
  const hours = Math.floor(movie.runtime / 60);
  const minutes = movie.runtime % 60;
  movieDuration.textContent = `${hours} h ${minutes} m`;
  
  // Update genres/tags
  movieTags.innerHTML = '';
  movie.genres.forEach(genre => {
    const genreSpan = document.createElement('span');
    genreSpan.className = 'movie-tag';
    genreSpan.textContent = genre.name;
    movieTags.appendChild(genreSpan);
  });
  
  // Update description
  descriptionText.textContent = movie.overview;
  
  // Update images
  if (movie.poster_path) {
    moviePoster.style.backgroundImage = `url(${IMAGE_URL}${movie.poster_path})`;
  }
  
  if (movie.backdrop_path) {
    movieBackdrop.style.backgroundImage = `url(${BACKDROP_PATH}${movie.backdrop_path})`;
  }
  
  // Update director (find director from crew)
  const director = movie.credits.crew.find(person => person.job === 'Director');
  directorInfo.textContent = director ? director.name : 'Unknown';
  
  // Update cast summary (just names)
  const mainCast = movie.credits.cast.slice(0, 3).map(actor => actor.name).join(', ');
  castInfo.textContent = mainCast || 'Unknown';
  
  // Update detailed cast grid
  updateCastGrid(movie.credits.cast, castGrid);
  
  // Update recommended movies
  updateRecommendedMovies(movie.recommendations.results, recommendedContent);
}

// Function to update cast grid
function updateCastGrid(cast, castGrid) {
  castGrid.innerHTML = '';
  
  // Take top 8 cast members
  cast.slice(0, 8).forEach(actor => {
    const castCard = document.createElement('div');
    castCard.className = 'cast-card';
    
    // Create HTML structure for cast card
    castCard.innerHTML = `
      <img src="${actor.profile_path ? IMAGE_URL + actor.profile_path : 'placeholder-image.jpg'}" 
           alt="${actor.name}" 
           class="cast-img">
      <div class="cast-info">
        <h3 class="cast-name">${actor.name}</h3>
        <p class="cast-character">${actor.character}</p>
      </div>
    `;
    
    castGrid.appendChild(castCard);
  });
}

// Function to update recommended movies section
function updateRecommendedMovies(movies, recommendedContent) {
  // Clear previous content
  recommendedContent.innerHTML = '';
  
  // Create row for movie cards
  const row = document.createElement('div');
  row.className = 'row movie-cards';
  
  // Add up to 6 recommended movies
  movies.slice(0, 6).forEach(movie => {
    const col = document.createElement('div');
    col.className = 'col-md-2 col-sm-4 col-6 mb-4';
    
    col.innerHTML = `
      <div class="movie-card">
        <a href="movie-details.html?id=${movie.id}">
          <img src="${movie.backdrop_path ? BACKDROP_PATH + movie.poster_path : 'placeholder-image.jpg'}" 
               alt="${movie.title}" 
               class="movie-card-img">
          <div class="movie-card-info">
            <h4 class="movie-card-title">${movie.title}</h4>
            <div class="movie-card-rating">
              <span class="rating-star"><i class="fas fa-star"></i></span>
              <span>${movie.vote_average.toFixed(1)}</span>
            </div>
          </div>
        </a>
      </div>
    `;
    
    row.appendChild(col);
  });
  
  recommendedContent.appendChild(row);
}

// Initialize tab functionality
function initTabs() {
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs and contents
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to clicked tab and corresponding content
      tab.classList.add('active');
      const tabId = tab.getAttribute('data-tab');
      const tabContent = document.getElementById(tabId);
      tabContent.classList.add('active');
    });
  });
}

// Handle "More" button for description
function initMoreButton() {
  const moreBtn = document.querySelector('.more-btn');
  const descriptionText = document.getElementById('description-text');
  
  moreBtn.addEventListener('click', () => {
    descriptionText.classList.toggle('expanded');
    moreBtn.textContent = descriptionText.classList.contains('expanded') ? 'Less' : 'More';
  });
}

// Main initialization function
async function initMovieDetails() {
  console.log("Initializing movie details...");
  
  if (movieId) {
    console.log("Fetching details for movie ID:", movieId);
    const movieData = await fetchMovieDetails();
    
    if (movieData) {
      console.log("Updating UI with movie data");
      updateMovieDetails(movieData);
    } else {
      console.error("Failed to fetch movie data");
      const movieTitle = document.querySelector('.movie-title');
      const descriptionText = document.getElementById('description-text');
      
      movieTitle.textContent = 'Movie Not Found';
      descriptionText.textContent = 'Sorry, we couldn\'t load the movie details. Please try again later.';
    }
  } else {
    console.warn("No movie ID provided in URL");
    const movieTitle = document.querySelector('.movie-title');
    const descriptionText = document.getElementById('description-text');
    
    movieTitle.textContent = 'Movie Not Selected';
    descriptionText.textContent = 'Please select a movie from the homepage.';
  }
  
  // Initialize UI interactions
  initTabs();
  initMoreButton();
}

// Run the main function when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM fully loaded");
  initMovieDetails();
});