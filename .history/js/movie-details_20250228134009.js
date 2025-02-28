// API Constants - moved inline to avoid CORS issues

// Get movie ID from URL
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("id");
const isMovie = urlParams.get("media_type") == "movie" ? true : false;

function updatePlayButton(trailer) {
  console.log(
    "https://www.youtube.com/watch?v=${trailer.key}" + "nasifmklnmsdf;lnf;mkldw"
  );

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

//  Safely Add The Elements
function safelySetTextContent(element, text) {
  if (element) {
    element.textContent = text;
  } else {
    console.warn(`Element not found for setting text: ${text}`);
  }
}

function safelySetStyle(element, property, value) {
  if (element) {
    element.style[property] = value;
  } else {
    console.warn(`Element not found for setting style: ${property}:${value}`);
  }
}
/***************** */


// Function to fetch movie details
async function fetchMovieDetails() {
  try {
    const response = await fetch(
      `${BASE_URL}/${
        isMovie ? "movie" : "tv"
      }/${movieId}?api_key=${API_KEY}&append_to_response=credits,recommendations,videos,reviews`
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
const watchLaterBtn = document
  .querySelector(".btn-secondary")
  .addEventListener("click", watchLater);

function watchLater() {
  if (localStorage.getItem("user") !== null)
    alert("added to watch later list successfully");
  else alert("please sign in first");
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
  const directorInfo = document.querySelector(".movie-meta .director-name");
  const castInfo = document.querySelector(
    ".movie-meta:nth-of-type(2) span:nth-child(2)"
  );
  const descriptionText = document.getElementById("description-text");
  const moviePoster = document.querySelector(".movie-poster");
  // const movieBackdrop = document.querySelector('.movie-backdrop');
  const castGrid = document.querySelector(".cast-grid");
  const recommendedContent = document.getElementById("recommended");
  const reviewsContent = document.getElementById("reviews");

  if (reviewsContent && movie.reviews) {
    updateReviewsSection(movie.reviews, reviewsContent);
  }
  safelySetTextContent(movieTitle, isMovie ? movie.title : movie.name);

  if (movieRating) {
    safelySetTextContent(movieRating, movie.vote_average.toFixed(1));
  }

  if (movieYear) {
    safelySetTextContent(
      movieYear,
      new Date(
        isMovie ? movie.release_date : movie.first_air_date
      ).getFullYear()
    );
  }

  // Format runtime to hours and minutes
  if (movieDuration && movie.runtime) {
    const hours = Math.floor(movie.runtime / 60);
    const minutes = movie.runtime % 60;
    safelySetTextContent(movieDuration, `${hours} h ${minutes} m`);
  }

  if (movieTags && movie.genres) {
    movieTags.innerHTML = "";
    movie.genres.forEach((genre) => {
      const genreSpan = document.createElement("span");
      genreSpan.className = "movie-tag";
      genreSpan.textContent = genre.name;
      movieTags.appendChild(genreSpan);
    });
  }

  safelySetTextContent(descriptionText, movie.overview);


  if (moviePoster && movie.backdrop_path) {
    safelySetStyle(
      moviePoster,
      "backgroundImage",
      `url(${BACKDROP_PATH}${movie.backdrop_path})`
    );
  }

  // Update director (find director from crew)
  if (directorInfo && movie.credits && movie.credits.crew) {
    (async () => {
      const director = isMovie
        ? movie.credits.crew.find((person) => person.job === "Director")?.name
        : (
            await fetch(
              `${BASE_URL}/tv/${movieId}/season/1/episode/1?api_key=${API_KEY}&append_to_response=credits`
            ).then((res) => res.json())
          ).credits?.crew.find((person) => person.job === "Director")?.name ||
          "Unknown";

      safelySetTextContent(directorInfo, director);
    })();
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
     <a href="actor.html?id=${actor.id}" >   <img src="${
      actor.profile_path
        ? IMAGE_URL + actor.profile_path
        : "placeholder-image.jpg"
    }" 
           alt="${actor.name}" 
           class="cast-img">
           </a>
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

  const row = document.createElement("div");
  row.className = "row movie-cards";

  // Add up to 6 recommended movies
  movies.slice(0, 6).forEach((movie, index) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add(
      "col-md-3",
      "col-sm-6",
      "col-lg-2",
      "movie-container"
    );
    movieCard.innerHTML = MovieCard(movie, index);
    row.appendChild(movieCard);
  });

  recommendedContent.appendChild(row);
}

// tabs (cast ,recommended ,reviews)
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

function updateReviewsSection(reviews, reviewsContent) {
  if (!reviewsContent) return;

  // Clear previous content
  reviewsContent.innerHTML = "";

  if (!reviews || reviews.results.length === 0) {
    const noReviews = document.createElement("div");
    noReviews.className = "no-reviews";
    noReviews.innerHTML = `
      <div class="text-center py-5">
        <i class="fa-solid fa-comment-slash fa-3x mb-3 text-muted"></i>
        <h3>No Reviews Yet</h3>
        <p>Be the first to review this ${isMovie ? "movie" : "show"}!</p>
      </div>
    `;
    reviewsContent.appendChild(noReviews);
    return;
  }

  // Create container for reviews
  const reviewsContainer = document.createElement("div");
  reviewsContainer.className = "reviews-container";

  // Add reviews
  reviews.results.forEach((review) => {
    const reviewCard = document.createElement("div");
    reviewCard.className = "review-card";

    // Format date
    const reviewDate = new Date(review.created_at);
    const formattedDate = reviewDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Extract rating if available in content (assumes format like "Rating: 8/10")
    let ratingHtml = "";
    const ratingMatch = review.content.match(
      /Rating:\s*(\d+(\.\d+)?)\s*\/\s*10/i
    );
    if (ratingMatch) {
      const rating = parseFloat(ratingMatch[1]);
      ratingHtml = `
        <div class="review-rating">
          <i class="fa-solid fa-star"></i> ${rating.toFixed(1)}/10
        </div>
      `;
    }

    let reviewContent = review.content;
    let readMoreHtml = "";

    if (reviewContent.length > 300) {
      const shortContent = reviewContent.substring(0, 300) + "...";
      readMoreHtml = `
        <div class="read-more-container">
          <span class="review-content-short">${shortContent}</span>
          <span class="review-content-full" style="display: none;">${reviewContent}</span>
          <button class="btn-read-more">Read more</button>
          <button class="btn-read-less" style="display: none;">Read less</button>
        </div>
      `;
      reviewContent = "";
    }

    // Create HTML structure for review card
    reviewCard.innerHTML = `
      <div class="review-header">
        <div class="reviewer-info">
          <div class="avatar">
            <i class="fa-solid fa-user"></i>
          </div>
          <div class="reviewer-details">
            <h4 class="reviewer-name">${review.author}</h4>
            <span class="review-date">${formattedDate}</span>
          </div>
        </div>
        ${ratingHtml}
      </div>
      <div class="review-body">
        ${readMoreHtml || `<p>${reviewContent}</p>`}
      </div>
      <div class="review-footer">
        <a href="${review.url}" target="_blank" class="btn-view-original">
          <i class="fa-solid fa-external-link"></i> View Original
        </a>
      </div>
    `;

    reviewsContainer.appendChild(reviewCard);
  });

  reviewsContent.appendChild(reviewsContainer);

  // Add event listeners for Read more/less buttons
  setTimeout(() => {
    const readMoreButtons = document.querySelectorAll(".btn-read-more");
    const readLessButtons = document.querySelectorAll(".btn-read-less");

    readMoreButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const container = this.closest(".read-more-container");
        container.querySelector(".review-content-short").style.display = "none";
        container.querySelector(".review-content-full").style.display = "block";
        this.style.display = "none";
        container.querySelector(".btn-read-less").style.display =
          "inline-block";
      });
    });

    readLessButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const container = this.closest(".read-more-container");
        container.querySelector(".review-content-short").style.display =
          "inline";
        container.querySelector(".review-content-full").style.display = "none";
        this.style.display = "none";
        container.querySelector(".btn-read-more").style.display =
          "inline-block";
      });
    });
  }, 100);
}

// Run the main function when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded");
  initMovieDetails();
});
