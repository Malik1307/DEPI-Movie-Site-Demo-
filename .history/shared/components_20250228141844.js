const MovieCard = (movie, index, hoverWindow = false) => {
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
    
    <!-- Movie detail hover overlay (Only shown if hoverWindow is true) -->
    ${
      hoverWindow
        ? `<div class="movie-detail">
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
          </div>`
        : ""
    }
  </a>
`;
};

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
const ActorMovieCard = (movie, index) => `
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
const getNavBar = () => {
  return `<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <a href="index.html">
          <div class="logo">
            <img src="../assets/images/movie-logo.png" class="logo_icon" alt=""/>
            <h1 class="navbar-brand">CineMirage</h1>
          </div>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse me-auto ms-4" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item"><a class="nav-link" href="./browse-category.html?category=movie">Movies</a></li>
            <li class="nav-item"><a class="nav-link" href="./browse-category.html?category=tv">TV Shows</a></li>
            <li class="nav-item"><a class="nav-link" href="./browse-category.html?category=anime">Anime</a></li>
            <li class="nav-item"><a class="nav-link" id="sign-up" href="./register.html">Sign Up</a></li>
            <li class="nav-item"><a class="nav-link" id="log-out" href="./index.html">Logout</a></li>
          </ul>
          <form id="search-form" class="search-form" action="search-results.html" method="get">
            <div class="search-box">
              <input type="text" id="search-input" name="query" class="search-input" placeholder="Search..."/>
              <button type="submit" class="search-button"><i class="fas fa-search"></i></button>
            </div>
          </form>
        </div>
      </div>
    </nav>`;
};

if (localStorage.getItem("user") !== null) {
  signUpBtn.style.display = "none";
  console.log("Key exists!");
} else {
  logOutBtn.style.display = "none";
}