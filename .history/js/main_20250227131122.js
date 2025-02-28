export const API_KEY = "4464a9cd6c3e0ee26ee5e6a893515421";
export const BASE_URL = "https://api.themoviedb.org/3";
 const IMAGE_URL = "https://image.tmdb.org/t/p/w440_and_h660_face";
export const BACKDROP_PATH = "https://image.tmdb.org/t/p/original";
export const MovieCard = (movie, index, isMovie = 1) => ` 

<a href="./movie-details.html?id=${movie.id}" class="movie-card-link">
<div class="movie-card">
    <div class="image-container">
        <img src="${IMAGE_URL + movie.poster_path}" alt="${
  isMovie ? movie.title : movie.name
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
<div class="movie-title">${isMovie ? movie.title : movie.name}</div>
</a>
`;

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

async function fetchingHomePage() {
  const moviesGrid = document.querySelector(".movies_grid");
  moviesGrid.innerHTML = "";
  const data = await fetchMovies("/trending/movie/week", "", 1);

  data.results.forEach((movie, index) => {
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
async function fetchingBrowseCategory() {
  const moviesGrid = document.querySelector(".movies_grid");
  moviesGrid.innerHTML = "";
  const data = await fetchMovies(
    "/discover/tv",
    "&with_genres=16&sort_by=popularity.desc",
    1
  );

  data.results.forEach((movie, index) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add(
      "col-md-3",
      "col-sm-6",
      "col-lg-2",
      "movie_container"
    );

    movieCard.innerHTML = MovieCard(movie, index, 0);

    moviesGrid.appendChild(movieCard);
  });
}

fetchingBrowseCategory();
