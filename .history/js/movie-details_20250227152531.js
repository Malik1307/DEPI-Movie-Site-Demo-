// API Constants - moved inline to avoid CORS issues
const API_KEY = "4464a9cd6c3e0ee26ee5e6a893515421";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w440_and_h660_face";
const BACKDROP_PATH = "https://image.tmdb.org/t/p/original";

// Get movie ID from URL
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("id");
const isMovie = urlParams.get("media_type")=="movie"?true:false;
function findBestTrailer(videos) {
  if (!videos || videos.length === 0) return null;

  // Filter for YouTube trailers
  const trailers = videos.filter(
    (video) => video.site === "YouTube" && video.type === "Trailer"
  );

  // Return the first trailer (or null if none exist)
  return trailers.length > 0 ? trailers[0] : null;
}
function updatePlayButton(trailer) {
  console.log("https://www.youtube.com/watch?v=${trailer.key}"+"nasifmklnmsdf;lnf;mkldw");
  
  const playButton = document.querySelector(".btn-play");

  if (playButton && trailer) {
    // Open the trailer in a new tab when the button is clicked
    playButton.addEventListener("click", () => {
      window.open(`https://www.youtube.com/watch?v=${trailer.key}`, "_blank");
    });
  } else {
    console.warn("Play button or trailer not found");
  }
}
console.log("Movie ID:", movieId);

// Function to safely update text content
function safelySetTextContent(element, text) {
  if (element) {
    element.textContent = text;
  } else {
    console.warn(`Element not found for setting text: ${text}`);
  }
}

// Function to safely update element style
function safelySetStyle(element, property, value) {
  if (element) {
    element.style[property] = value;
  } else {
    console.warn(`Element not found for setting style: ${property}:${value}`);
  }
}

// Function to fetch movie details
async function fetchMovieDetails() {

  try {
    const response = await fetch(
      `${BASE_URL}/${isMovie?"movie":"tv"}/${movieId}?api_key=${API_KEY}&append_to_response=credits,recommendations,videos`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch movie details");
    }

    const data = await response.json();
    console.log("Movie data fetched:", data);
    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
}

// Function to update UI with movie details
function updateMovieDetails(movie) {
  if (!movie) {
    console.error("No movie data available to update UI");
    return;
  }

  // Get all elements with null checks
  const movieTitle = document.querySelector(".movie-title");
  const movieRating = document.querySelector(".movie-rating .fw-bold");
  const movieYear = document.querySelector(".movie-info span:nth-child(2)");
  const movieDuration = document.querySelector(".movie-info span:nth-child(3)");
  const movieTags = document.querySelector(".movie-tags");
  const directorInfo = document.querySelector(
    ".movie-meta .director-name"
  );
  const castInfo = document.querySelector(
    ".movie-meta:nth-of-type(2) span:nth-child(2)"
  );
  const descriptionText = document.getElementById("description-text");
  const moviePoster = document.querySelector(".movie-poster");
  // const movieBackdrop = document.querySelector('.movie-backdrop');
  const castGrid = document.querySelector(".cast-grid");
  const recommendedContent = document.getElementById("recommended");

  // Update basic info with null checks
  safelySetTextContent(movieTitle, movie.title);

  if (movieRating) {
    safelySetTextContent(movieRating, movie.vote_average.toFixed(1));
  }

  if (movieYear) {
    safelySetTextContent(movieYear, new Date(movie.release_date).getFullYear());
  }

  // Format runtime to hours and minutes
  if (movieDuration && movie.runtime) {
    const hours = Math.floor(movie.runtime / 60);
    const minutes = movie.runtime % 60;
    safelySetTextContent(movieDuration, `${hours} h ${minutes} m`);
  }

  // Update genres/tags
  if (movieTags && movie.genres) {
    movieTags.innerHTML = "";
    movie.genres.forEach((genre) => {
      const genreSpan = document.createElement("span");
      genreSpan.className = "movie-tag";
      genreSpan.textContent = genre.name;
      movieTags.appendChild(genreSpan);
    });
  }

  // Update description
  safelySetTextContent(descriptionText, movie.overview);

  // Update images

  if (moviePoster && movie.backdrop_path) {
    safelySetStyle(
      moviePoster,
      "backgroundImage",
      `url(${BACKDROP_PATH}${movie.backdrop_path})`
    );
  }

  // Update director (find director from crew)
  if (directorInfo && movie.credits && movie.credits.crew) {
    const director = movie.credits.crew.find(
      (person) => person.job === "Director"
    );
    safelySetTextContent(directorInfo, director ? director.name : "Unknown");
  }

  // Update cast summary (just names)
  if (castInfo && movie.credits && movie.credits.cast) {
    const mainCast = movie.credits.cast
      .slice(0, 3)
      .map((actor) => actor.name)
      .join(", ");
    safelySetTextContent(castInfo, mainCast || "Unknown");
  }

  // Update detailed cast grid
  if (castGrid && movie.credits && movie.credits.cast) {
    updateCastGrid(movie.credits.cast, castGrid);
  }

  // Update recommended movies
  if (
    recommendedContent &&
    movie.recommendations &&
    movie.recommendations.results
  ) {
    updateRecommendedMovies(movie.recommendations.results, recommendedContent);
  }
  if (movie.videos && movie.videos.results) {
    const bestTrailer = findBestTrailer(movie.videos.results);
    updatePlayButton(bestTrailer);
  }

  if (directorInfo && movie.credits && movie.credits.crew) {
    console.log("Full crew data:", movie.credits.crew); // Debug log
    const director = movie.credits.crew.find(
      (person) => person.job === "Director"
    );
    console.log("Found director:", director); // Debug log
    safelySetTextContent(directorInfo, director ? director.name : "Unknown");
  }
}

// Function to update cast grid
function updateCastGrid(cast, castGrid) {
  if (!castGrid) return;

  castGrid.innerHTML = "";

  // Take top 8 cast members
  cast.slice(0, 8).forEach((actor) => {
    const castCard = document.createElement("div");
    castCard.className = "cast-card";

    // Create HTML structure for cast card
    castCard.innerHTML = `
      <img src="${
        actor.profile_path
          ? IMAGE_URL + actor.profile_path
          : "placeholder-image.jpg"
      }" 
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
  if (!recommendedContent) return;

  // Clear previous content
  recommendedContent.innerHTML = "";

  // Create row for movie cards
  const row = document.createElement("div");
  row.className = "row movie-cards";

  // Add up to 6 recommended movies
  movies.slice(0, 6).forEach((movie) => {
    const col = document.createElement("div");
    col.className = "col-md-2 col-sm-4 col-6 mb-4";

    col.innerHTML = `
      <div class="movie-card">
        <a href="movie-details.html?id=${movie.id}">
          <img src="${
            movie.poster_path
              ? IMAGE_URL + movie.backdrop_path
              : "placeholder-image.jpg"
          }" 
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
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll(".tab-content");

  if (!tabs.length || !tabContents.length) {
    console.warn("Tabs elements not found");
    return;
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Remove active class from all tabs and contents
      tabs.forEach((t) => t.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      // Add active class to clicked tab and corresponding content
      tab.classList.add("active");
      const tabId = tab.getAttribute("data-tab");
      const tabContent = document.getElementById(tabId);
      if (tabContent) {
        tabContent.classList.add("active");
      }
    });
  });
}

// Handle "More" button for description

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
      const movieTitle = document.querySelector(".movie-title");
      const descriptionText = document.getElementById("description-text");

      if (movieTitle) {
        movieTitle.textContent = "Movie Not Found";
      }

      if (descriptionText) {
        descriptionText.textContent =
          "Sorry, we couldn't load the movie details. Please try again later.";
      }
    }
  } else {
    console.warn("No movie ID provided in URL");
    const movieTitle = document.querySelector(".movie-title");
    const descriptionText = document.getElementById("description-text");

    if (movieTitle) {
      movieTitle.textContent = "Movie Not Selected";
    }

    if (descriptionText) {
      descriptionText.textContent = "Please select a movie from the homepage.";
    }
  }

  // Initialize UI interactions
  initTabs();
}

// Run the main function when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded");
  initMovieDetails();
});
