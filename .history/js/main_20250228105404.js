const API_KEY = "4464a9cd6c3e0ee26ee5e6a893515421";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";
const BACKDROP_URL = "https://image.tmdb.org/t/p/w780";

// Function to generate a Netflix-style Media Card with hover details
const MediaCard = (media, showBadge = false, badgeText = "") => {
  const title = media.media_type === "movie" ? media.title : media.name;
  const year = media.release_date ? media.release_date.substring(0, 4) : 
               media.first_air_date ? media.first_air_date.substring(0, 4) : "2021";
  const rating = media.vote_average ? media.vote_average.toFixed(1) : "9.5";
  const episodes = Math.floor(Math.random() * 30) + 10; // Simulating episode count
  
  // Generate random genres for demo purposes
  const genres = ["Romance", "Urban", "Chinese Mainland", "Drama"];
  const randomGenres = [];
  for (let i = 0; i < Math.min(3, Math.floor(Math.random() * 3) + 1); i++) {
    const randomIndex = Math.floor(Math.random() * genres.length);
    if (!randomGenres.includes(genres[randomIndex])) {
      randomGenres.push(genres[randomIndex]);
    }
  }
  
  // Generate a shortened description
  const description = media.overview ? 
    (media.overview.length > 150 ? media.overview.substring(0, 150) + "..." : media.overview) : 
    "A teenager accidentally receives a love letter to her first love, and their love story begins. They have contacted and met again in their adult life...";
  
  return `
  <div class="media-card">
    <div class="card-image-container">
      <img src="${media.poster_path ? IMAGE_URL + media.poster_path : 'https://via.placeholder.com/500x750'}" 
           alt="${title}">
      <div class="overlay"></div>
      ${showBadge ? `<div class="badge ${badgeText.toLowerCase().includes('free') ? 'free-badge' : 'top-badge'}">${badgeText}</div>` : ''}
      <div class="episode-count">${episodes} Episodes</div>
    </div>
    <div class="media-title">${title}</div>
    
    <!-- Hover Detail Card (Initially Hidden) -->
    <div class="detail-card">
      <div class="detail-backdrop">
        <img src="${media.backdrop_path ? BACKDROP_URL + media.backdrop_path : media.poster_path ? IMAGE_URL + media.poster_path : 'https://via.placeholder.com/780x440'}" alt="${title} backdrop">
        <div class="detail-title">${title}</div>
        <div class="play-button"><i class="fa-solid fa-play"></i></div>
      </div>
      <div class="detail-info">
        <div class="detail-meta">
          <div class="detail-rating"><i class="fa-solid fa-star"></i> ${rating}</div>
          <div class="detail-year-time">${year} | 13+</div>
        </div>
        <div class="detail-tags">
          ${randomGenres.map(genre => `<span class="tag">${genre}</span>`).join('')}
        </div>
        <div class="detail-description">${description}</div>
      </div>
    </div>
  </div>
  `;
};

// Create a row with title and horizontal scrolling content
function createMediaRow(title, mediaItems) {
  const rowContainer = document.createElement('div');
  rowContainer.className = 'genre-row';
  
  let mediaCards = '';
  mediaItems.forEach((item, index) => {
    let badge = '';
    if (index < 3) {
      badge = 'TOP 10';
    } else if (index % 4 === 0) {
      badge = 'Free';
    } else if (index % 5 === 0) {
      badge = 'Original';
    } else if (index % 6 === 0) {
      badge = 'Limited';
    }
    
    mediaCards += `<div class="media-item">
      ${MediaCard(item, !!badge, badge)}
    </div>`;
  });
  
  rowContainer.innerHTML = `
    <h2 class="row-title">${title}</h2>
    <div class="media-row">
      <div class="media-row-scroll">
        ${mediaCards}
      </div>
      <button class="scroll-btn scroll-next">
        <i class="fa-solid fa-chevron-right"></i>
      </button>
    </div>
  `;
  
  return rowContainer;
}

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

// Load all media rows
async function loadAllMediaRows() {
  const container = document.querySelector('.container');
  container.innerHTML = ''; // Clear existing content
  
  // Fetch different categories
  const trendingMovies = await fetchData('/trending/movie/week');
  const trendingTV = await fetchData('/trending/tv/week');
  const upcomingMovies = await fetchData('/movie/upcoming');
  const popularTV = await fetchData('/tv/popular');
  const nowPlayingMovies = await fetchData('/movie/now_playing');
  const topRatedTV = await fetchData('/tv/top_rated');
  
  // Process results to add media_type if not present
  trendingMovies.results.forEach(item => item.media_type = "movie");
  upcomingMovies.results.forEach(item => item.media_type = "movie");
  nowPlayingMovies.results.forEach(item => item.media_type = "movie");
  trendingTV.results.forEach(item => item.media_type = "tv");
  popularTV.results.forEach(item => item.media_type = "tv");
  topRatedTV.results.forEach(item => item.media_type = "tv");
  
  // Add section header
  const movieHeader = document.createElement('h1');
  movieHeader.className = 'section-header';
  movieHeader.textContent = 'Movies';
  container.appendChild(movieHeader);
  
  // Add movie rows
  container.appendChild(createMediaRow('Trending Movies', trendingMovies.results));
  container.appendChild(createMediaRow('Now Playing', nowPlayingMovies.results));
  container.appendChild(createMediaRow('Upcoming Movies', upcomingMovies.results));
  
  // Add section header for TV
  const tvHeader = document.createElement('h1');
  tvHeader.className = 'section-header';
  tvHeader.textContent = 'TV Shows';
  container.appendChild(tvHeader);
  
  // Add TV rows
  container.appendChild(createMediaRow('Trending TV Shows', trendingTV.results));
  container.appendChild(createMediaRow('Popular Shows', popularTV.results));
  container.appendChild(createMediaRow('Top Rated Shows', topRatedTV.results));
  
  // Add event listeners for scroll buttons
  setupScrollButtons();
}

// Setup scroll button functionality
function setupScrollButtons() {
  document.querySelectorAll('.scroll-next').forEach(button => {
    button.addEventListener('click', (e) => {
      const row = e.target.closest('.media-row');
      const scrollContainer = row.querySelector('.media-row-scroll');
      scrollContainer.scrollBy({
        left: 600,
        behavior: 'smooth'
      });
    });
  });
}

// Add CSS for Netflix-style layout with hover detail cards
function addStyles() {
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    body {
      background-color: #0c0c0c;
      color: white;
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 0;
    }
    
    .container {
      padding: 20px;
    }
    
    .section-header {
      font-size: 2rem;
      margin: 30px 0 15px 10px;
    }
    
    .row-title {
      font-size: 1.5rem;
      margin: 0 0 15px 10px;
      font-weight: 600;
    }
    
    .genre-row {
      margin-bottom: 40px;
    }
    
    .media-row {
      position: relative;
      width: 100%;
    }
    
    .media-row-scroll {
      display: flex;
      overflow-x: auto;
      padding: 10px 0;
      scroll-behavior: smooth;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none; /* Hide scrollbar for Firefox */
    }
    
    .media-row-scroll::-webkit-scrollbar {
      display: none; /* Hide scrollbar for Chrome/Safari */
    }
    
    .media-item {
      flex: 0 0 auto;
      width: 210px;
      margin-right: 15px;
      position: relative;
    }
    
    .media-card {
      position: relative;
      transition: transform 0.2s ease;
      cursor: pointer;
      height: 100%;
    }
    
    /* Normal card styling */
    .card-image-container {
      position: relative;
      border-radius: 4px;
      overflow: hidden;
      aspect-ratio: 2/3;
    }
    
    .card-image-container img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%);
    }
    
    .badge {
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 3px 8px;
      border-radius: 3px;
      font-size: 0.75rem;
      font-weight: bold;
      z-index: 10;
    }
    
    .top-badge {
      background-color: #00cc44;
      color: white;
    }
    
    .free-badge {
      background-color: #00cc44;
      color: white;
    }
    
    .episode-count {
      position: absolute;
      bottom: 10px;
      left: 10px;
      color: white;
      font-size: 0.8rem;
      z-index: 10;
    }
    
    .media-title {
      margin-top: 8px;
      font-size: 0.9rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    /* Detail card styling (for hover) */
    .detail-card {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: auto;
      background-color: #151515;
      border-radius: 4px;
      box-shadow: 0 14px 30px rgba(0, 0, 0, 0.6);
      opacity: 0;
      visibility: hidden;
      transform: translateY(0);
      transition: all 0.3s ease;
      z-index: 50;
      overflow: hidden;
    }
    
    .media-card:hover .detail-card {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    
    .media-card:hover {
      transform: scale(1.05);
      z-index: 100;
    }
    
    .detail-backdrop {
      position: relative;
      height: 120px;
    }
    
    .detail-backdrop img {
      width: 100%;
      height: 100%;
      object-fit: cover;
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
      font-size: 0.95rem;
    }
    
    .play-button {
      position: absolute;
      right: 10px;
      bottom: 10px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: #00cc44;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      cursor: pointer;
    }
    
    .detail-info {
      padding: 10px;
    }
    
    .detail-meta {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    
    .detail-rating {
      color: #ffc107;
      font-weight: bold;
      font-size: 0.85rem;
    }
    
    .detail-year-time {
      color: #aaa;
      font-size: 0.85rem;
    }
    
    .detail-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin-bottom: 8px;
    }
    
    .tag {
      background-color: #333;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.7rem;
    }
    
    .detail-description {
      font-size: 0.75rem;
      color: #ddd;
      margin-bottom: 8px;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .scroll-btn {
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      background-color: rgba(0, 0, 0, 0.7);
      color: white;
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      font-size: 1.2rem;
      cursor: pointer;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .scroll-btn:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
  `;
  document.head.appendChild(styleEl);
}

// Initialize everything on page load
document.addEventListener('DOMContentLoaded', () => {
  addStyles();
  loadAllMediaRows();
  
  // Add Font Awesome if not already included
  if (!document.querySelector('link[href*="font-awesome"]')) {
    const fontAwesome = document.createElement('link');
    fontAwesome.rel = 'stylesheet';
    fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(fontAwesome);
  }
});