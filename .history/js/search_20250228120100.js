const API_KEY = "4464a9cd6c3e0ee26ee5e6a893515421";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w440_and_h660_face";

// DOM elements
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

// Check if we're on the search results page
const isSearchResultsPage = window.location.pathname.includes('search-results.html');

// Only initialize these elements if on the search results page
let searchQueryDisplay, loadingIndicator;
let moviesSection, showsSection, peopleSection;
let moviesResults, showsResults, peopleResults;

if (isSearchResultsPage) {
  searchQueryDisplay = document.getElementById('search-query-display');
  loadingIndicator = document.getElementById('loading-indicator');
  
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
  console.log("DOM fully loaded");
  
  // Only process search parameters if on the search page
  if (isSearchResultsPage) {
    console.log("On search results page");
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');
    
    if (query) {
      console.log("Query found:", query);
      searchInput.value = query;
      searchQueryDisplay.textContent = `Search "${query}"`;
      performSearch(query);
    }
  }
  
  // Always attach search form event listener if the form exists
  if (searchForm) {
    console.log("Search form found, attaching event listener");
    
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      console.log("Search form submitted");
      
      const searchQuery = searchInput.value.trim();
      
      if (searchQuery.length > 0) {
        console.log("Search query:", searchQuery);
        
        // Simplified path handling
        const searchResultsUrl = `./search-results.html?query=${encodeURIComponent(searchQuery)}`;
        
        console.log("Redirecting to:", searchResultsUrl);
        
        // Use window.location.href for navigation
        window.location.href = searchResultsUrl;
      }
    });
  } else {
    console.error("Search form not found on page!");
  }
});

// Perform TMDB API multi-search
function performSearch(query) {
  // Only run on search results page
  if (!isSearchResultsPage) return;
  
  console.log("Performing search for:", query);
  
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
      console.log("Search results received:", data.results.length);
      // Process and display results
      displaySearchResults(data.results);
    })
    .catch(error => {
      console.error('Error fetching search results:', error);
      
      // Display error message
      moviesResults.innerHTML = '<div class="no-results">Error fetching results. Please try again later.</div>';
      moviesSection.style.display = 'block';
    })
    .finally(() => {
      // Hide loading indicator
      loadingIndicator.style.display = 'none';
    });
}

// Display search results categorized by type
function displaySearchResults(results) {
  // Filter results by media type and limit to 5 items
  const movies = results.filter(item => item.media_type === 'movie').slice(0, 5);
  const shows = results.filter(item => item.media_type === 'tv').slice(0, 5);
  const people = results.filter(item => item.media_type === 'person').slice(0, 5);

  console.log(`Found: ${movies.length} movies, ${shows.length} shows, ${people.length} people`);

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
  resultItem.className = 'result-item mx-2';
  
  const imageUrl = item.poster_path 
    ? `${IMAGE_URL}${item.poster_path}` 
    : '/assets/images/no-poster.png'; // Updated to absolute path
  
  const year = type === 'movie' 
    ? (item.release_date ? item.release_date.substring(0, 4) : 'N/A') 
    : (item.first_air_date ? item.first_air_date.substring(0, 4) : 'N/A');
  
  resultItem.innerHTML = `
    <div class="search-image-container">
      <img src="${imageUrl}" alt="${item.title || item.name}" class="result-image" onerror="this.src='/assets/images/no-poster.png'">
    </div>
    <div class="result-details ">
      <h4>${item.title || item.name}</h4>
      <p>${type === 'movie' ? 'Movie' : 'TV Show'} • ${year}</p>
      <p>${item.overview ? item.overview.substring(0, 100) + '...' : 'No description available'}</p>
    </div>
  `;
  
  // Make item clickable
  resultItem.style.cursor = 'pointer';
  resultItem.addEventListener('click', () => {
    window.location.href = `../screens/movie-details.html?id=${item.id}&media_type=${type}`; // Updated to absolute path
  });
  
  return resultItem;
}

// Create HTML for person result
function createPersonItem(person) {
  const resultItem = document.createElement('div');
  resultItem.className = 'result-item';
  
  const imageUrl = person.profile_path 
    ? `${IMAGE_URL}${person.profile_path}` 
    : '/assets/images/no-profile.png'; // Updated to absolute path
  
  resultItem.innerHTML = `
    <div class="search-image-container">
      <img src="${imageUrl}" alt="${person.name}" class="people-image" onerror="this.src='/assets/images/no-profile.png'">
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
    window.location.href = `../screens/actor.html?id=${person.id}`; // Updated to absolute path
  });
  
  return resultItem;
}