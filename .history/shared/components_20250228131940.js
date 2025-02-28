const MovieCard = (movie, index,hover=false) => {
  const genreNames = getGenreNames(movie.genre_ids, movie).slice(0, 3);

  return `
  <a href="./movie-details.html?id=${movie.id}&media_type=${
    movie.media_type
  }" class="movie-card-link">
    <div class="movie-card">
      <div class="image-container">
        <img src="${IMAGE_URL + movie.poster_path}" alt="${
    movie.media_type === "movie" ? movie.title : movie.name
  }">
        <div class="overlay"></div>
        <div class="rating"><i class="fa-solid fa-star"></i> ${movie.vote_average.toFixed(
          1
        )}</div>
      </div>
      ${index % 3 == 0 ? '<div class="top-badge">TOP 10</div>' : ""}
    </div>
    <div class="movie-title">${
      movie.media_type === "movie" ? movie.title : movie.name
    }</div>
    
    <!-- Movie detail hover overlay -->
    <div class="movie-detail">
      <div class="detail-backdrop">
        <img src="${IMAGE_URL + movie.backdrop_path}" alt="${
    movie.media_type === "movie" ? movie.title : movie.name
  }">
        <div class="detail-title">${
          movie.media_type === "movie" ? movie.title : movie.name
        }</div>
      </div>
      <div class="detail-info">
        <div class="detail-meta">
          <div class="detail-rating"><i class="fa-solid fa-star"></i> ${movie.vote_average.toFixed(
            1
          )}</div>
          <div class="detail-year-time">${
            movie.release_date?.substring(0, 4) ||
            movie.first_air_date?.substring(0, 4) ||
            ""
          }</div>
        </div>
      <div class="detail-tags">
          ${genreNames
            .map((name) => `<span class="tag">${name}</span>`)
            .join("")}
          <span class="tag">${
            movie.media_type === "movie" ? "MOVIE" : "TV"
          }</span>
        </div>
        <div class="detail-description">${
          movie.overview || "No description available."
        }</div>
      </div>
    </div>
  </a>
`;
};