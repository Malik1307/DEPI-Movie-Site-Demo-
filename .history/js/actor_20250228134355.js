const urlParams = new URLSearchParams(window.location.search);
const actorId = urlParams.get("id");

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