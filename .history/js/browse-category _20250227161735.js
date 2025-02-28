
async function fetchMovies(endPoint, query, pageNumber) {
async function fetchMovies(endPoint, query, pageNumber) {
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

async function fetchingBrowseCategory() {
  const moviesGrid = document.querySelector(".movies_grid");
  moviesGrid.innerHTML = "";
  const data = await fetchMovies(
    "/discover/all",
    "&with_genres=16",
    1
  );

  data.results.forEach((movie, index) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add(
      "col-md-3",
      "col-sm-6",
      "col-lg-2",
      "movie_container"
    );

    movieCard.innerHTML = MovieCard(movie, index, 0);

    moviesGrid.appendChild(movieCard);
  });
}