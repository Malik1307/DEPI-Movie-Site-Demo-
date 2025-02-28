const API_KEY = "4464a9cd6c3e0ee26ee5e6a893515421";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w440_and_h660_face";
const BACKDROP_PATH = "https://image.tmdb.org/t/p/original";
const MovieCard = (movie, index, isMovie = 1) => {
  const movieTitle = isMovie ? movie.title : movie.name;
  const releaseYear =
    new Date(
      isMovie ? movie.release_date : movie.first_air_date
    ).getFullYear() || "N/A";
  const runtime = isMovie
    ? "2h"
    : movie.episode_run_time
    ? `${movie.episode_run_time[0]}m`
    : "N/A";

  return `
    <div class="movie-card">
                    <div class="image-container">
                        <img src="https://image.tmdb.org/t/p/w440_and_h660_face/ekstpH614fwDX8DUln1a2Opz0N8.jpg" alt="error" onerror="this.src='/api/placeholder/200/300'">
                        <div class="overlay"></div>
                        <div class="rating"><i class="fa-solid fa-star"></i> ${movie.vote_average.toFixed(1)}</div>
                    </div>
                    ${index < 10 ? '<div class="top-badge">TOP ' + (index + 1) + '</div>' : ''}
                </div>
                <div class="movie-title">${isMovie ? movie.title : movie.name}</div>

                <!-- Hover Detail Card -->
                <div class="movie-detail">
                    <div class="detail-backdrop">
                        <img src="${BACKDROP_PATH+movie.BACKDROP_PATH}" alt="backdrop" onerror="this.src='/api/placeholder/300/150'">
                        <div class="play-button">
                            <i class="fa-solid fa-play"></i>
                        </div>
                        <div class="detail-title">${isMovie ? movie.title : movie.name}</div>
                    </div>
                    <div class="detail-info">
                        <div class="detail-meta">
                            <div class="detail-rating"><i class="fa-solid fa-star" style="color: #FFC107;"></i> ${movie.vote_average.toFixed(1)}</div>
                            <div class="detail-year-time">${movie.release_year} • ${movie.runtime}</div>
                        </div>
                        <div class="detail-tags">
                            <div class="tag">${movie.country}</div>
                            <div class="tag">${movie.genre}</div>
                        </div>
                        <div class="detail-description">${movie.overview}</div>
                        <a href="#" class="more-info">more info ></a>
                    </div>
                </div>
  `;
};

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
document.addEventListener('DOMContentLoaded', fetchingHomePage);


fetchingHomePage();
