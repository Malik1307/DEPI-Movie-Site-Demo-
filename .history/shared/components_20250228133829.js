// Movie Card Component
const MovieCard = (movie, index, hoverWindow = false) => {
  const genreNames = getGenreNames(movie.genre_ids, movie.media_type).slice(0, 3);

  return `
    <a href="./movie-details.html?id=${movie.id}&media_type=${movie.media_type}" class="movie-card-link">
      <div class="movie-card">
        <div class="image-container">
          <img src="${IMAGE_URL + movie.poster_path}" alt="${movie.title || movie.name}">
          <div class="overlay"></div>
          <div class="rating"><i class="fa-solid fa-star"></i> ${movie.vote_average.toFixed(1)}</div>
        </div>
        ${index % 3 == 0 ? '<div class="top-badge">TOP 10</div>' : ""}
      </div>
      <div class="movie-title">${movie.title || movie.name}</div>
      ${hoverWindow ? `
        <div class="movie-detail">
          <div class="detail-backdrop">
            <img src="${IMAGE_URL + movie.backdrop_path}" alt="${movie.title || movie.name}">
            <div class="detail-title">${movie.title || movie.name}</div>
          </div>
          <div class="detail-info">
            <div class="detail-meta">
              <div class="detail-rating"><i class="fa-solid fa-star"></i> ${movie.vote_average.toFixed(1)}</div>
              <div class="detail-year-time">${movie.release_date?.substring(0, 4) || movie.first_air_date?.substring(0, 4) || ""}</div>
            </div>
            <div class="detail-tags">
              ${genreNames.map((name) => `<span class="tag">${name}</span>`).join("")}
              <span class="tag">${movie.media_type === "movie" ? "MOVIE" : "TV"}</span>
            </div>
            <div class="detail-description">${movie.overview || "No description available."}</div>
          </div>
        </div>
      ` : ""}
    </a>
  `;
};

// Category Card Component
const categoryCard = (movie, index) => `
  <a href="./movie-details.html?id=${movie.id}&media_type=${category !== "movie" ? "tv" : "movie"}" class="movie-card-link">
    <div class="movie-card">
      <div class="image-container">
        <img src="${IMAGE_URL + movie.poster_path}" alt="${category !== "movie" ? movie.name : movie.title}">
        <div class="overlay"></div>
        <div class="rating"><i class="fa-solid fa-star"></i> ${movie.vote_average.toFixed(1)}</div>
      </div>
      ${index % 3 == 0 ? '<div class="top-badge">TOP 10</div>' : ""}
    </div>
    <div class="movie-title">${category !== "movie" ? movie.name : movie.title}</div>
  </a>
`;

// Cast Grid Component
const updateCastGrid = (cast, castGrid) => {
  if (!castGrid) return;

  castGrid.innerHTML = "";

  cast.slice(0, 8).forEach((actor) => {
    const castCard = document.createElement("div");
    castCard.className = "cast-card";
    castCard.innerHTML = `
      <a href="actor.html?id=${actor.id}">
        <img src="${actor.profile_path ? IMAGE_URL + actor.profile_path : PLACEHOLDER_IMAGE}" 
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
};

// Recommended Movies Component
const updateRecommendedMovies = (movies, recommendedContent) => {
  if (!recommendedContent) return;

  recommendedContent.innerHTML = "";

  const row = document.createElement("div");
  row.className = "row movie-cards";

  movies.slice(0, 6).forEach((movie, index) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("col-md-3", "col-sm-6", "col-lg-2", "movie-container");
    movieCard.innerHTML = MovieCard(movie, index);
    row.appendChild(movieCard);
  });

  recommendedContent.appendChild(row);
};

// Reviews Component
const updateReviewsSection = (reviews, reviewsContent) => {
  if (!reviewsContent) return;

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

  const reviewsContainer = document.createElement("div");
  reviewsContainer.className = "reviews-container";

  reviews.results.forEach((review) => {
    const reviewCard = document.createElement("div");
    reviewCard.className = "review-card";
    reviewCard.innerHTML = `
      <div class="review-header">
        <div class="reviewer-info">
          <div class="avatar">
            <i class="fa-solid fa-user"></i>
          </div>
          <div class="reviewer-details">
            <h4 class="reviewer-name">${review.author}</h4>
            <span class="review-date">${new Date(review.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
          </div>
        </div>
      </div>
      <div class="review-body">
        <p>${review.content}</p>
      </div>
    `;
    reviewsContainer.appendChild(reviewCard);
  });

  reviewsContent.appendChild(reviewsContainer);
};