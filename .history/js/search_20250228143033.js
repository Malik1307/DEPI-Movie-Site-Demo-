document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("navbar-container").innerHTML = getNavBar(); // Ensure navbar loads

  // Select buttons after navbar is loaded
  const signUpBtn = document.querySelector("#sign-up");
  const logOutBtn = document.querySelector("#log-out");

  if (logOutBtn && signUpBtn) {
    if (localStorage.getItem("user") !== null) {
      signUpBtn.style.display = "none";
      console.log("User is logged in, hiding Sign Up button.");
    } else {
      logOutBtn.style.display = "none";
      console.log("User is logged out, hiding Logout button.");
    }
  } else {
    console.warn("SignUp or Logout button not found in navbar.");
  }

  // --- SEARCH PAGE LOGIC ---
  const isSearchResultsPage = window.location.pathname.includes("search-results.html");

  let searchQueryDisplay, loadingIndicator;
  let moviesSection, showsSection, peopleSection;
  let moviesResults, showsResults, peopleResults;

  if (isSearchResultsPage) {
    searchQueryDisplay = document.getElementById("search-query-display");
    loadingIndicator = document.getElementById("loading-indicator");

    moviesSection = document.getElementById("movies-section");
    showsSection = document.getElementById("shows-section");
    peopleSection = document.getElementById("people-section");

    moviesResults = document.getElementById("movies-results");
    showsResults = document.getElementById("shows-results");
    peopleResults = document.getElementById("people-results");
  }

  // --- SEARCH FORM LOGIC ---
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");

  if (searchForm && searchInput) {
    console.log("Search form found, attaching event listener");

    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      console.log("Search form submitted");

      const searchQuery = searchInput.value.trim();

      if (searchQuery.length > 0) {
        console.log("Search query:", searchQuery);
        window.location.href = `./search-results.html?query=${encodeURIComponent(searchQuery)}`;
      }
    });
  } else {
    console.warn("Search form not found on this page.");
  }

  // --- PROCESS SEARCH QUERY ---
  if (isSearchResultsPage) {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("query");

    if (query) {
      console.log("Query found:", query);
      searchInput.value = query;
      searchQueryDisplay.textContent = `Search "${query}"`;
      performSearch(query);
    }
  }
});

// --- SEARCH FUNCTION ---
function performSearch(query) {
  console.log("Performing search for:", query);

  if (!loadingIndicator || !moviesSection || !showsSection || !peopleSection) {
    console.error("One or more search elements not found.");
    return;
  }

  loadingIndicator.style.display = "block";

  moviesSection.style.display = "none";
  showsSection.style.display = "none";
  peopleSection.style.display = "none";

  moviesResults.innerHTML = "";
  showsResults.innerHTML = "";
  peopleResults.innerHTML = "";

  fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response error: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("Search results received:", data.results.length);
      displaySearchResults(data.results);
    })
    .catch(error => {
      console.error("Error fetching search results:", error);
      moviesResults.innerHTML = '<div class="no-results">Error fetching results. Please try again later.</div>';
      moviesSection.style.display = "block";
    })
    .finally(() => {
      loadingIndicator.style.display = "none";
    });
}
