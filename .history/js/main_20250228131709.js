

let currentPage = 1;
const totalPages = 10;



// Function to generate a Movie Card

const signUpBtn = document.querySelector("#sign-up");
const logOutBtn = document.querySelector("#log-out");
if (localStorage.getItem("user") !== null) {
  signUpBtn.style.display = "none";
  console.log("Key exists!");
} else {
  logOutBtn.style.display = "none";
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
          <div class="infocap">${movie.adult ? "R" : "+13"}</div>
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
    localStorage.removeItem("user").then(() => console.log("yeah"));
  } else {
    console.log("User canceled the action.");
  }
}

// Initial Fetch
loadMovies(1);

logOutBtn.addEventListener("click", logOut);
