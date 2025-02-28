document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const resultsContainer = document.getElementById("searchResults");
  
  // Ensure loadingIndicator is only referenced when defined
  let loadingIndicator = document.getElementById("loadingIndicator");
  let isSearchResultsPage = resultsContainer !== null;

  searchButton.addEventListener("click", function () {
      const query = searchInput.value.trim();
      if (query) {
          performSearch(query);
      }
  });

  function performSearch(query) {
      if (!isSearchResultsPage) {
          console.error("Search attempted on incorrect page.");
          return;
      }

      if (!loadingIndicator) {
          console.warn("loadingIndicator is not found.");
          return;
      }

      // Show loading indicator
      loadingIndicator.style.display = "block";

      // Simulating API request (Replace with actual API call)
      setTimeout(() => {
          loadingIndicator.style.display = "none";
          resultsContainer.innerHTML = `<p>Results for "<strong>${query}</strong>"</p>`;
      }, 2000);
  }
});
