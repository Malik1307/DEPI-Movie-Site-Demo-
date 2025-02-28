const API_KEY = "4464a9cd6c3e0ee26ee5e6a893515421";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w440_and_h660_face";
const BACKDROP_PATH = "https://image.tmdb.org/t/p/original";
const genreList = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western"
};

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
  <style>
    body {
        background-color: var(--primary-color);
        color: var(--text-color);
        font-family: "Arial", sans-serif;
      }

    

      .movie-card {
        width: 200px;
        border-radius: 10px;
        overflow: hidden;
        position: relative;
        transition: transform 0.3s ease;
      }

      .image-container {
        position: relative;
        width: 100%;
        height: 300px;
      }

      .image-container img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 60px;
        background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
      }

      .rating {
        position: absolute;
        bottom: 10px;
        left: 10px;
        color: var(--rating-color);
        font-weight: bold;
      }

      .top-badge {
        position: absolute;
        top: 10px;
        left: 10px;
        background-color: var(--accent-color);
        color: white;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: bold;
      }

      .movie-title {
        margin-top: 8px;
        font-weight: bold;
        width: 200px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* Hover detail styles */
      .movie-detail {
        position: absolute;
        left: 0;
        top: 0;
        width: 300px;
        background-color: var(--secondary-color);
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
        z-index: 100;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s;
        overflow: hidden;
      }

      .movie-container:hover .movie-detail {
        opacity: 1;
        visibility: visible;
      }

      .detail-backdrop {
        position: relative;
        height: 150px;
      }

      .detail-backdrop img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .play-button {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: var(--accent-color);
        color: white;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }

      .detail-title {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 10px;
        background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
        color: white;
        font-weight: bold;
      }

      .detail-info {
        padding: 15px;
      }

      .detail-meta {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
      }

      .detail-year-time {
        color: #aaa;
        font-size: 14px;
      }

      .detail-tags {
        display: flex;
        gap: 5px;
        margin-bottom: 10px;
      }

      .tag {
        background-color: #333;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 12px;
      }

      .detail-description {
        font-size: 14px;
        color: #ddd;
        margin-bottom: 10px;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .more-info {
        text-align: right;
        color: var(--accent-color);
        font-size: 12px;
        text-decoration: none;
      }

      .more-info:hover {
        text-decoration: underline;
      }
  </style>
    <div class="movie-card">
                    <div class="image-container">
                        <img src="${IMAGE_URL+movie.poster_path}" alt="error" onerror="this.src='/api/placeholder/200/300'">
                        <div class="overlay"></div>
                        <div class="rating"><i class="fa-solid fa-star"></i> ${movie.vote_average.toFixed(1)}</div>
                    </div>
                    ${index < 10 ? '<div class="top-badge">TOP ' + (index + 1) + '</div>' : ''}
                </div>
                <div class="movie-title">${isMovie ? movie.title : movie.name}</div>

                <!-- Hover Detail Card -->
                <div class="movie-detail">
                    <div class="detail-backdrop">
                        <img src="${BACKDROP_PATH+movie.backdrop_path}" alt="backdrop" onerror="this.src='/api/placeholder/300/150'">
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
                            <div class="tag">${movie.genre_ids.map(id=> genreList[id]).join()}</div>
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
      "movie-container"
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
      "movie-container"
    );

    movieCard.innerHTML = MovieCard(movie, index, 0);

    moviesGrid.appendChild(movieCard);
  });
}
document.addEventListener('DOMContentLoaded', fetchingHomePage);


fetchingHomePage();
