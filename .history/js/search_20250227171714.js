const API_KEY = "4464a9cd6c3e0ee26ee5e6a893515421";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w440_and_h660_face";

// DOM elements
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const searchQueryDisplay = document.getElementById('search-query-display');
const loadingIndicator = document.getElementById('loading-indicator');

// Section containers - Only try to access these on the search results page
let moviesSection, showsSection, peopleSection;
let moviesResults, showsResults, peopleResults;

// Check if we're on the search results page
const isSearchResultsPage = window.location.pathname.includes('search-results.html');

// Initialize result page elements if we're on the search results page
if (isSearchResultsPage) {
  // Section containers
  moviesSection = document.getElementById('movies-section');
  showsSection = document.getElementById('shows-section');
  peopleSection = document.getElementById('people-section');

  // Results containers
  moviesResults = document.getElementById('movies-results');
  showsResults = document.getElementById('shows-results');
  peopleResults = document.getElementById('people-results');
}

// Check for search query parameter on page load
window.addEventListener('DOMContentLoaded', () => {
  // Always ensure we have access to the search form
  if (!searchForm || !searchInput) {
    console.error('Search form elements not found on page');
    return;
  }
  
  // Handle query parameter if on search results page
  if (isSearchResultsPage) {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');
    
    if (query && searchQueryDisplay) {
      searchInput.value = query;
      searchQueryDisplay.textContent = `Search "${query}"`;
      performSearch(query);
    }
  }
});

// Search form submission handler
if (searchForm) {
  searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    console.log('Search form submitted');
    
    const searchQuery = searchInput.value.trim();
    
    if (searchQuery.length > 0) {
      // Determine correct path to search results page
      // If we're on the home page (index.html), the search-results.html is in the same directory
      // If we're on the home page but it's in the root, we need to go to pages/search-results.html
      let searchResultsPath;
      
      // Check if we're on the home page in the root directory
      if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
        searchResultsPath = '../screens/ssearch-results.html';
      } 
      // If we're in a specific directory structure
      else if (window.location.pathname.includes('/pages/')) {
        searchResultsPath = 'search-results.html';
      }
      // Default fallback
      else {
        searchResultsPath = './pages/search-results.html';
      }
      
      console.log(`Redirecting to: ${searchResultsPath}?query=${encodeURIComponent(searchQuery)}`);
      window.location.href = `${searchResultsPath}?query=${encodeURIComponent(searchQuery)}`;
    }
  });
}

// Perform TMDB API multi-search
function performSearch(query) {
  // Only proceed if we're on the search results page with the required elements
  if (!isSearchResultsPage || !loadingIndicator || !moviesSection) {
    console.error('Not on search results page or elements missing');
    return;
  }
  
  // Show loading indicator
  loadingIndicator.style.display = 'block';
  
  // Hide previous results
  moviesSection.style.display = 'none';
  showsSection.style.display = 'none';
  peopleSection.style.display = 'none';
  
  // Clear previous results
  moviesResults.innerHTML = '';
  showsResults.innerHTML = '';
  peopleResults.innerHTML = '';
  
  // API request
  fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response error: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Process and display results
      displaySearchResults(data.results);
    })
    .catch(error => {
      console.error('Error fetching search results:', error);
      
      // Display error message
      if (moviesResults) {
        moviesResults.innerHTML = '<div class="no-results">Error fetching results. Please try again later.</div>';
        moviesSection.style.display = 'block';
      }
    })
    .finally(() => {
      // Hide loading indicator
      if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
      }
    });
}

// Display search results categorized by type
function displaySearchResults(results) {
  if (!isSearchResultsPage) return;
  
  // Filter results by media type
  const movies = results.filter(item => item.media_type === 'movie');
  const shows = results.filter(item => item.media_type === 'tv');
  const people = results.filter(item => item.media_type === 'person');
  
  // Display movies if any
  if (movies.length > 0) {
    movies.forEach(movie => {
      moviesResults.appendChild(createMovieOrShowItem(movie, 'movie'));
    });
    moviesSection.style.display = 'block';
  }
  
  // Display TV shows if any
  if (shows.length > 0) {
    shows.forEach(show => {
      showsResults.appendChild(createMovieOrShowItem(show, 'tv'));
    });
    showsSection.style.display = 'block';
  }
  
  // Display people if any
  if (people.length > 0) {
    people.forEach(person => {
      peopleResults.appendChild(createPersonItem(person));
    });
    peopleSection.style.display = 'block';
  }
  
  // Display "no results" message if nothing was found
  if (movies.length === 0 && shows.length === 0 && people.length === 0) {
    moviesResults.innerHTML = '<div class="no-results">No results found. Try a different search term.</div>';
    moviesSection.style.display = 'block';
  }
}

// Create HTML for movie or TV show result
function createMovieOrShowItem(item, type) {
  const resultItem = document.createElement('div');
  resultItem.className = 'result-item';
  
  const imageUrl = item.poster_path 
    ? `${IMAGE_URL}${item.poster_path}` 
    : '../assets/images/no-poster.png';
  
  const year = type === 'movie' 
    ? (item.release_date ? item.release_date.substring(0, 4) : 'N/A') 
    : (item.first_air_date ? item.first_air_date.substring(0, 4) : 'N/A');
  
  resultItem.innerHTML = `
    <div class="search-image-container">
      <img src="${imageUrl}" alt="${item.title || item.name}" class="result-image" onerror="this.src='../assets/images/no-poster.png'">
    </div>
    <div class="result-details">
      <h4>${item.title || item.name}</h4>
      <p>${type === 'movie' ? 'Movie' : 'TV Show'} • ${year}</p>
      <p>${item.overview ? item.overview.substring(0, 100) + '...' : 'No description available'}</p>
    </div>
  `;
  
  // Make item clickable
  resultItem.style.cursor = 'pointer';
  resultItem.addEventListener('click', () => {
    window.location.href = `${type}-details.html?id=${item.id}`;
  });
  
  return resultItem;
}

// Create HTML for person result
function createPersonItem(person) {
  const resultItem = document.createElement('div');
  resultItem.className = 'result-item';
  
  const imageUrl = person.profile_path 
    ? `${IMAGE_URL}${person.profile_path}` 
    : '../assets/images/no-profile.png';
  
  resultItem.innerHTML = `
    <div class="search-image-container">
      <img src="${imageUrl}" alt="${person.name}" class="people-image" onerror="this.src='../assets/images/no-profile.png'">
    </div>
    <div class="result-details">
      <h4>${person.name}</h4>
      <p>Known for: ${person.known_for_department || 'Acting'}</p>
      <p>
        ${person.known_for ? 
          person.known_for.map(item => item.title || item.name).slice(0, 2).join(', ') : 
          'No known works'}
      </p>
    </div>
  `;
  
  // Make item clickable
  resultItem.style.cursor = 'pointer';
  resultItem.addEventListener('click', () => {
    window.location.href = `person-details.html?id=${person.id}`;
  });
  
  return resultItem;
}