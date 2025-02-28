
const API_KEY = "4464a9cd6c3e0ee26ee5e6a893515421";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w440_and_h660_face";

const urlParams = new URLSearchParams(window.location.search);
const actorId = urlParams.get("id") ; 

const MovieCard = (movie, index) => `
<a href="./movie-details.html?id=${movie.id}&media_type=movie" class="movie-card-link">
  <div class="movie-card">
    <div class="image-container">
      <img src="${IMAGE_URL + movie.poster_path}" alt="${
      movie.  original_title
}">
      <div class="overlay"></div>
      <div class="rating"><i class="fa-solid fa-star"></i> ${movie.vote_average.toFixed(
        1
      )}</div>
    </div>
    ${index % 3 == 0 ? '<div class="top-badge">TOP 10</div>' : ""}
  </div>
  <div class="movie-title">${
   movie.original_title 
  }</div>
</a>
`;

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
  // Select the films div
  // const filmsDiv = document.querySelector('.films');
  
  const moviesGrid = document.querySelector(".movies_grid");
  moviesGrid.innerHTML = "";


  movies.forEach((movie, index) => {
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

// Main initialization function
async function init() {
  // Add Bootstrap CSS if not already included
  if (!document.querySelector('link[href*="bootstrap"]')) {
    const bootstrapLink = document.createElement('link');
    bootstrapLink.rel = 'stylesheet';
    bootstrapLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css';
    document.head.appendChild(bootstrapLink);
  }
  
  // Add Font Awesome if not already included
  if (!document.querySelector('link[href*="font-awesome"]')) {
    const fontAwesomeLink = document.createElement('link');
    fontAwesomeLink.rel = 'stylesheet';
    fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(fontAwesomeLink);
  }

  // Fetch actor data
  const actorData = await fetchActorDetails();
  
  if (actorData) {
    // Update actor information
    updateActorUI(actorData);
    
    // Sort movies by popularity (highest first)
    const movies = actorData.movie_credits.cast.sort((a, b) => b.popularity - a.popularity);
    
    // Update movies grid
    updateMoviesGrid(movies);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);