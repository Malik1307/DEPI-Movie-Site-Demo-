const API_KEY = "4464a9cd6c3e0ee26ee5e6a893515421";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w440_and_h660_face";

// Function to generate a Movie Card
const MediaCard = (media) => `
<div class="media-card">
  <a href="./movie-details.html?id=${media.id}&media_type=${media.media_type}" class="media-card-link">
    <div class="card-image">
      <img src="${media.poster_path ? IMAGE_URL + media.poster_path : 'https://via.placeholder.com/220x330'}" 
           alt="${media.media_type === "movie" ? media.title : media.name}">
      <div class="overlay"></div>
      <div class="rating"><i class="fa-solid fa-star"></i> ${media.vote_average ? media.vote_average.toFixed(1) : 'N/A'}</div>
    </div>
    <div class="media-title">${media.media_type === "movie" ? media.title : media.name}</div>
  </a>
</div>
`;

// Fetch data from API
async function fetchData(endpoint, params = {}) {
  try {
    const queryParams = new URLSearchParams({
      api_key: API_KEY,
      language: 'en-US',
      ...params
    });
    
    const response = await fetch(`${BASE_URL}${endpoint}?${queryParams}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    return { results: [] };
  }
}

// Create a row with title and horizontal scrolling content
function createRow(title, mediaItems) {
  const rowContainer = document.createElement('div');
  rowContainer.className = 'media-row-container my-4';
  
  rowContainer.innerHTML = `
    <h2 class="row-title mb-3">${title}</h2>
    <div class="media-row">
      <div class="media-scroll-container">
        ${mediaItems.map(item => MediaCard(item)).join('')}
      </div>
    </div>
  `;
  
  return rowContainer;
}

// Load all media rows
async function loadMediaRows() {
  const container = document.querySelector('.container');
  container.innerHTML = ''; // Clear existing content
  
  // Fetch different categories
  const trendingMovies = await fetchData('/trending/movie/week');
  const trendingTV = await fetchData('/trending/tv/week');
  const upcomingMovies = await fetchData('/movie/upcoming');
  const popularTV = await fetchData('/tv/popular');
  const nowPlayingMovies = await fetchData('/movie/now_playing');
  const topRatedTV = await fetchData('/tv/top_rated');
  
  // Add rows to container
  container.appendChild(createRow('Trending Movies', trendingMovies.results));
  container.appendChild(createRow('Trending TV Shows', trendingTV.results));
  container.appendChild(createRow('Now Playing Movies', nowPlayingMovies.results));
  container.appendChild(createRow('Popular TV Shows', popularTV.results));
  container.appendChild(createRow('Upcoming Movies', upcomingMovies.results));
  container.appendChild(createRow('Top Rated TV Shows', topRatedTV.results));
  
  // Add event listeners for scroll buttons if needed
  // setupScrollButtons();
}

// Add CSS for horizontal scrolling
function addStyles() {
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    .media-row-container {
      margin-bottom: 30px;
    }
    
    .row-title {
      font-size: 1.5rem;
      margin-left: 10px;
      color: #fff;
    }
    
    .media-row {
      position: relative;
      width: 100%;
      overflow: hidden;
    }
    
    .media-scroll-container {
      display: flex;
      overflow-x: auto;
      padding: 10px 5px;
      scroll-behavior: smooth;
      -webkit-overflow-scrolling: touch;
      gap: 15px;
    }
    
    .media-scroll-container::-webkit-scrollbar {
      height: 8px;
    }
    
    .media-scroll-container::-webkit-scrollbar-track {
      background: #222;
      border-radius: 4px;
    }
    
    .media-scroll-container::-webkit-scrollbar-thumb {
      background: #13c6b0;
      border-radius: 4px;
    }
    
    .media-card {
      flex: 0 0 auto;
      width: 180px;
      transition: transform 0.3s ease;
    }
    
    .media-card:hover {
      transform: scale(1.05);
    }
    
    .card-image {
      position: relative;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
    
    .card-image img {
      width: 100%;
      height: 270px;
      object-fit: cover;
    }
    
    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7));
    }
    
    .rating {
      position: absolute;
      bottom: 10px;
      right: 10px;
      background-color: rgba(0, 0, 0, 0.7);
      color: #13c6b0;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.85rem;
    }
    
    .media-title {
      color: #fff;
      font-size: 0.95rem;
      margin-top: 8px;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .media-card-link {
      text-decoration: none;
    }
  `;
  document.head.appendChild(styleEl);
}

// Initialize everything on page load
document.addEventListener('DOMContentLoaded', () => {
  addStyles();
  loadMediaRows();
  
  // Load carousel if needed
  if (document.querySelector('.carousel-inner')) {
    loadCarousel();
  }
});

// Carousel function (keeping from your original code)
async function fetchTrending() {
  try {
    const response = await fetch(
      `${BASE_URL}/trending/all/week?api_key=${API_KEY}&language=en-US&page=1`
    );
    const data = await response.json();
    return data.results.slice(0, 6); // Get first 6 items
  } catch (error) {
    console.error("Error fetching trending data:", error);
    return [];
  }
}

async function loadCarousel() {
  const trendingItems = await fetchTrending();
  const carouselInner = document.querySelector(".carousel-inner");
  const carouselIndicators = document.querySelector(".carousel-indicators");

  if (!carouselInner || !carouselIndicators) return;

  carouselInner.innerHTML = "";
  carouselIndicators.innerHTML = "";

  trendingItems.forEach((movie, index) => {
    const year = movie.media_type === "movie"
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
    itemDiv.className = `carousel-item ${index ===.0 ? "active" : ""}`;
    itemDiv.dataset.bsInterval = "2000";
    itemDiv.innerHTML = `
      <img src="https://image.tmdb.org/t/p/original${movie.backdrop_path}" 
           class="d-block carousel-img w-100" alt="${movie.title || movie.name}">
      <div class="carousel-caption">
        <h1>${movie.title || movie.name}</h1>
        <div class="info">
          <div class="infocap" style="color: #13c6b0">
            <i class="fa-solid fa-star" style="color: #13c6b0"></i> ${movie.vote_average.toFixed(1)}
          </div>
          <div class="infocap">${year}</div>
          <div class="infocap">+13</div>
        </div>
      </div>
    `;
    carouselInner.appendChild(itemDiv);
  });
}