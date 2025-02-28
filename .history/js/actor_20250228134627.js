
const urlParams = new URLSearchParams(window.location.search);
const actorId = urlParams.get("id") ; 


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
    movieCard.innerHTML = ActorMovieCard(movie, index);
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