const API_KEY = "4464a9cd6c3e0ee26ee5e6a893515421";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w440_and_h660_face";

let currentPage = 1; // Track the current page
const totalPages = 10; // Set a max limit
const movieGenres = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" }
];

const tvGenres = [
  { id: 10759, name: "Action & Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 10762, name: "Kids" },
  { id: 9648, name: "Mystery" },
  { id: 10763, name: "News" },
  { id: 10764, name: "Reality" },
  { id: 10765, name: "Sci-Fi & Fantasy" },
  { id: 10766, name: "Soap" },
  { id: 10767, name: "Talk" },
  { id: 10768, name: "War & Politics" },
  { id: 37, name: "Western" }
];

const getGenreNames = (genreIds) => {
  if (!genreIds || genreIds.length === 0) return [];
  
  const genres = movie.media_type === "movie" ? movieGenres : tvGenres;
  return genreIds
    .map(id => {
      const genre = genres.find(g => g.id === id);
      return genre ? genre.name : null;
    })
    .filter(name => name !== null);
};

// Function to generate a Movie Card
const MovieCard = (movie, index) => { return `
  <a href="./movie-details.html?id=${movie.id}&media_type=${movie.media_type}" class="movie-card-link">
    <div class="movie-card">
      <div class="image-container">
        <img src="${IMAGE_URL + movie.poster_path}" alt="${movie.media_type === "movie" ? movie.title : movie.name}">
        <div class="overlay"></div>
        <div class="rating"><i class="fa-solid fa-star"></i> ${movie.vote_average.toFixed(1)}</div>
      </div>
      ${index % 3 == 0 ? '<div class="top-badge">TOP 10</div>' : ""}
    </div>
    <div class="movie-title">${movie.media_type === "movie" ? movie.title : movie.name}</div>
    
    <!-- Movie detail hover overlay -->
    <div class="movie-detail">
      <div class="detail-backdrop">
        <img src="${IMAGE_URL + (movie.backdrop_path )}" alt="${movie.media_type === "movie" ? movie.title : movie.name}">
        <div class="detail-title">${movie.media_type === "movie" ? movie.title : movie.name}</div>
      </div>
      <div class="detail-info">
        <div class="detail-meta">
          <div class="detail-rating"><i class="fa-solid fa-star"></i> ${movie.vote_average.toFixed(1)}</div>
          <div class="detail-year-time">${movie.release_date?.substring(0, 4) || movie.first_air_date?.substring(0, 4) || ''}</div>
        </div>
        <div class="detail-tags">
          ${movie.genre_ids ? movie.genre_ids.slice(0, 3).map(id => `<span class="tag">Genre</span>`).join('') : ''}
          <span class="tag">${movie.media_type?.toUpperCase()}</span>
        </div>
        <div class="detail-description">${movie.overview || 'No description available.'}</div>
      </div>
    </div>
  </a>
`
};
const signUpBtn = document.querySelector("#sign-up");
const logOutBtn = document.querySelector("#log-out");
if (localStorage.getItem("user") !== null) {
signUpBtn.style.display="none";
  console.log("Key exists!");
} else {
  logOutBtn.style.display="none";;
}
// if (true) signUpBtn.style.display = "none";

// Fetch Movies from API
async function fetchMovies(endpoint, query, pageNumber) {
  try {
    const response = await fetch(
      `${BASE_URL + endpoint}?api_key=${
        API_KEY + query
      }&language=en-US&page=${pageNumber}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

// Function to Load Movies 
async function loadMovies(page) {
  const moviesGrid = document.querySelector(".movies-grid");
  moviesGrid.innerHTML = "";
  currentPage = page;

  const data = await fetchMovies("/trending/all/week", "", currentPage);

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

  updatePaginationButtons();
}
async function fetchTrending() {
  try {
    const response = await fetch(
      `${BASE_URL}/trending/all/week?api_key=${API_KEY}&language=en-US&page=1`
    );
    const data = await response.json();
    return data.results.slice(0, 10); // Get first 10 items
  } catch (error) {
    console.error("Error fetching trending data:", error);
    return [];
  }
}

function createCarouselItem(movie, isActive) {
  const year =
    movie.media_type === "movie"
      ? (movie.release_date || "").substring(0, 4)
      : (movie.first_air_date || "").substring(0, 4);

  const imageUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : "https://via.placeholder.com/1200x600"; // Fallback image

  const title = movie.media_type === "movie" ? movie.title : movie.name;
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

  return `
    <div class="carousel-item ${
      isActive ? "active" : ""
    }" data-bs-interval="2000">
      <img src="${imageUrl}" class="d-block w-100" alt="${title}">
      <div class="carousel-caption">
        <h1>${title}</h1>
        <div class="info">
          <div class="infocap" style="color: #13c6b0">
            <i class="fa-solid fa-star" style="color: #13c6b0"></i> ${rating}
          </div>
          <div class="infocap">${year || "N/A"}</div>
          <div class="infocap">${movie.du}</div>
        </div>
        <div class="genres mt-2">
          ${movie.genre_ids
            .slice(0, 3)
            .map(
              (id) =>
                `<div class="gcontent">${getGenreName(
                  id,
                  movie.media_type
                )}</div>`
            )
            .join("")}
        </div>
        <p>${
          movie.overview?.substring(0, 150) || "No description available."
        }...</p>
        <div class="buttons">
          <i class="fa-solid fa-circle-play playbutton me-2" style="color: #13c6b0"></i>
          <svg width="60px" height="60px" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
            <!-- Your watch later SVG code -->
          </svg>
        </div>
      </div>
    </div>
  `;
}
async function loadCarousel() {
  const trendingItems = await fetchTrending();
  const carouselInner = document.querySelector(".carousel-inner");
  const carouselIndicators = document.querySelector(".carousel-indicators");

  carouselInner.innerHTML = "";
  carouselIndicators.innerHTML = "";

  trendingItems.forEach((movie, index) => {
    const year =
      movie.media_type === "movie"
        ? (movie.release_date || "").substring(0, 4)
        : (movie.first_air_date || "").substring(0, 4);

    const indicator = document.createElement("button");
    indicator.type = "button";
    indicator.dataset.bsTarget = "#carouselExampleFade";
    indicator.dataset.bsSlideTo = index;
    indicator.ariaLabel = `Slide ${index + 1}`;
    if (index === 0) {
      indicator.classList.add("active");
      indicator.ariaCurrent = "true";
    }
    carouselIndicators.appendChild(indicator);

    const itemDiv = document.createElement("div");
    itemDiv.className = `carousel-item ${index === 0 ? "active" : ""}`;
    itemDiv.dataset.bsInterval = "2000";
    itemDiv.innerHTML = `
      <img src="https://image.tmdb.org/t/p/original${movie.backdrop_path}" 
           class="d-block carousel-img w-100" alt="${
             movie.title || movie.name
           }">
      <div class="carousel-caption">
        <h1>${movie.title || movie.name}</h1>
        <div class="info">
          <div class="infocap" style="color: #13c6b0">
            <i class="fa-solid fa-star" style="color: #13c6b0"></i> ${movie.vote_average.toFixed(
              1
            )}
          </div>
          <div class="infocap">${year}</div>
          <div class="infocap">${movie.adult?"R":"+13"}</div>
        </div>
      </div>
    `;
    carouselInner.appendChild(itemDiv);
  });
}

document.addEventListener("DOMContentLoaded", loadCarousel);

// Function to Update Pagination Buttons
function updatePaginationButtons() {
  document.getElementById("prevPage").disabled = currentPage === 1;
  document.getElementById("nextPage").disabled = currentPage === totalPages;
  document.getElementById("pageNumber").textContent = `Page ${currentPage}`;
}

// Event Listeners for Pagination
document.getElementById("prevPage").addEventListener("click", () => {
  if (currentPage > 1) loadMovies(currentPage - 1);
});

document.getElementById("nextPage").addEventListener("click", () => {
  if (currentPage < totalPages) loadMovies(currentPage + 1);
});

function logOut() {
  if (confirm("Are you sure you want to do this?")) {
    localStorage.removeItem("user").then(()=>console.log("yeah"));

} else {
    console.log("User canceled the action.");
}

}


// Initial Fetch
loadMovies(1);

logOutBtn.addEventListener("click",logOut);
