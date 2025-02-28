const API_KEY = "4464a9cd6c3e0ee26ee5e6a893515421";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w440_and_h660_face";
const BACKDROP_PATH = "https://image.tmdb.org/t/p/original";

const MovieCard = (movie, index) => ` 

<a href="./movie-details.html?id=${movie.id}&media_type=${
  movie.media_type
}" class="movie-card-link">
<div class="movie-card">
    <div class="image-container">
        <img src="${IMAGE_URL + movie.poster_path}" alt="${
  movie.media_type == "movie" ? movie.title : movie.name
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
<div class="movie-title">${
  movie.media_type == "movie" ? movie.title : movie.name
}</div>
</a>
`;

let category = urlParams.get("category");

async function fetchMovies(endPoint, query, pageNumber) {
  try {
    const response = await fetch(
      `${BASE_URL + endPoint}?api_key=${
        API_KEY + query
      }&language=en-US&page=${pageNumber}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

async function fetchingBrowseCategory() {
  const moviesGrid = document.querySelector(".movies_grid");
  moviesGrid.innerHTML = "";
  const data = await fetchMovies("/discover/tv", "&with_genres=16", 1);

  data.results.forEach((movie, index) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add(
      "col-md-3",
      "col-sm-6",
      "col-lg-2",
      "movie-container"
    );

    movieCard.innerHTML = MovieCard(movie, index, 0);

    moviesGrid.appendChild(movieCard);
  });
}
fetchingBrowseCategory();
