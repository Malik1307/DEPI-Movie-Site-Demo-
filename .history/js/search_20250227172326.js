const API_KEY = "4464a9cd6c3e0ee26ee5e6a893515421";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w440_and_h660_face";

// DOM elements
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM loaded");
  
  // First check if we're on search results page
  const isSearchPage = window.location.pathname.includes('search-results.html');
  console.log("Is search page:", isSearchPage);
  
  // Set up search form on any page
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  
  if (searchForm && searchInput) {
    console.log("Search form found");
    
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      console.log("Form submitted");
      
      const query = searchInput.value.trim();
      
      if (query.length > 0) {
        // Determine correct path based on current location
        let searchPath = 'pages/search-results.html';
        if (isSearchPage) {
          searchPath = 'search-results.html';
        }
        
        console.log("Redirecting to:", searchPath);
        window.location.href = `${searchPath}?query=${encodeURIComponent(query)}`;
      }
    });
  }
  
  // Only initialize search results functionality if on search page
  if (isSearchPage) {
    console.log("Initializing search results page");
    
    // Get search results page elements
    const searchQueryDisplay = document.getElementById('search-query-display');
    const loadingIndicator = document.getElementById('loading-indicator');
    const moviesSection = document.getElementById('movies-section');
    const showsSection = document.getElementById('shows-section');
    const peopleSection = document.getElementById('people-section');
    const moviesResults = document.getElementById('movies-results');
    const showsResults = document.getElementById('shows-results');
    const peopleResults = document.getElementById('people-results');
    
    // Check if all required elements exist
    if (!searchQueryDisplay || !loadingIndicator || !moviesSection || 
        !showsSection || !peopleSection || !moviesResults || 
        !showsResults || !peopleResults) {
      console.error("Missing required elements on search results page!");
      return;
    }
    
    // Process search query from URL
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');
    
    if (query) {
      console.log("Found query in URL:", query);
      searchInput.value = query;
      searchQueryDisplay.textContent = `Search "${query}"`;
      
      // Show loading indicator
      loadingIndicator.style.display = 'block';
      
      // Hide results sections initially
      moviesSection.style.display = 'none';
      showsSection.style.display = 'none';
      peopleSection.style.display = 'none';
      
      // Clear any previous results
      moviesResults.innerHTML = '';
      showsResults.innerHTML = '';
      peopleResults.innerHTML = '';
      
      // API request
      console.log("Fetching search results from API");
      fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`)
        .then(response => {
          console.log("API response status:", response.status);
          if (!response.ok) {
            throw new Error(`Network error: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log("Search results received:", data);
          
          // Process and display results
          displaySearchResults(data.results, {
            moviesSection, showsSection, peopleSection,
            moviesResults, showsResults, peopleResults
          });
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
    } else {
      console.error("No query parameter found in URL");
      searchQueryDisplay.textContent = "No search query provided";
      moviesResults.innerHTML = '<div class="no-results">Please enter a search term.</div>';
      moviesSection.style.display = 'block';
      loadingIndicator.style.display = 'none';
    }
  }
});

// Display search results categorized by type
function displaySearchResults(results, elements) {
  console.log("Displaying search results:", results.length);
  
  const { moviesSection, showsSection, peopleSection,
          moviesResults, showsResults, peopleResults } = elements;
  
  // Filter results by media type
  const movies = results.filter(item => item.media_type === 'movie');
  const shows = results.filter(item => item.media_type === 'tv');
  const people = results.filter(item => item.media_type === 'person');
  
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
          'No know