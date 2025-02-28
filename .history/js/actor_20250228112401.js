
const API_KEY = "4464a9cd6c3e0ee26ee5e6a893515421";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w440_and_h660_face";

const urlParams = new URLSearchParams(window.location.search);
const actorId = urlParams.get("id") ; 

const movieGenres = [
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
  { id: 37, name: "Western" }
];

const tvGenres = [
  { id: 10759, name: "Action & Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 10762, name: "Kids" },
  { id: 9648, name: "Mystery" },
  { id: 10763, name: "News" },
  { id: 10764, name: "Reality" },
  { id: 10765, name: "Sci-Fi & Fantasy" },
  { id: 10766, name: "Soap" },
  { id: 10767, name: "Talk" },
  { id: 10768, name: "War & Politics" },
  { id: 37, name: "Western" }
];

const getGenreNames = (genreIds,movie) => {
  if (!genreIds || genreIds.length === 0) return [];
  
  const genres = movie.media_type === "movie" ? movieGenres : tvGenres;
  return genreIds
    .map(id => {
      const genre = genres.find(g => g.id === id);
      return genre ? genre.name : null;
    })
    .filter(name => name !== null);
};

// Function to generate a Movie Card
const MovieCard = (movie, index) => { 
const genreNames = getGenreNames(movie.genre_ids,movie).slice(0, 3);
  
  return `
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
    
    <!-- Movie detail hover overlay -->
    <div class="movie-detail">
      <div class="detail-backdrop">
        <img src="${IMAGE_URL + (movie.backdrop_path )}" alt="${movie.media_type === "movie" ? movie.title : movie.name}">
        <div class="detail-title">${movie.media_type === "movie" ? movie.title : movie.name}</div>
      </div>
      <div class="detail-info">
        <div class="detail-meta">
          <div class="detail-rating"><i class="fa-solid fa-star"></i> ${movie.vote_average.toFixed(1)}</div>
          <div class="detail-year-time">${movie.release_date?.substring(0, 4) || movie.first_air_date?.substring(0, 4) || ''}</div>
        </div>
      <div class="detail-tags">
          ${genreNames.map(name => `<span class="tag">${name}</span>`).join('')}
          <span class="tag">${movie.media_type === "movie" ? "MOVIE" : "TV"}</span>
        </div>
        <div class="detail-description">${movie.overview || 'No description available.'}</div>
      </div>
    </div>
  </a>
`
};

async function fetchActorDetails() {
  try {
    const response = await fetch(
      `${BASE_URL}/person/${actorId}?api_key=${API_KEY}&append_to_response=movie_credits`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch actor details");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching actor details:", error);
    return null;
  }
}

function updateActorUI(actor) {
  if (!actor) return;

  const actorNameElements = document.querySelectorAll('.actorName, h2');
  actorNameElements.forEach(el => {
    if (el.tagName === 'H2') {
      el.textContent = actor.name;
    } else {
      el.textContent = `${actor.name} (born ${new Date(actor.birthday).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})})`;
    }
  });

  const actorBio = document.querySelector('.actorBio');
  if (actorBio) {
    actorBio.textContent = actor.biography;
  }

  const actorImage = document.querySelector('.aboutActor img');
  if (actorImage && actor.profile_path) {
    
    actorImage.src = IMAGE_URL + actor.profile_path;
    actorImage.alt = actor.name;
  }
}

// Function to update movies grid
function updateMoviesGrid(movies) {

  
  const moviesGrid = document.querySelector(".movies-grid");
  moviesGrid.innerHTML = "";


  movies.forEach((movie, index) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add(
      "col-md-3",
      "col-sm-6",
      "col-lg-2",
      "movie-container"
    );
    movieCard.innerHTML = MovieCard(movie, index);
    moviesGrid.appendChild(movieCard);
  });
}

// Main initialization function
async function init() {

  


  const actorData = await fetchActorDetails();
  
  if (actorData) {
    updateActorUI(actorData);
    
    // Sort movies by popularity (highest first)
    const movies = actorData.movie_credits.cast.sort((a, b) => b.popularity - a.popularity);
    
    // Update movies grid
    updateMoviesGrid(movies);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);