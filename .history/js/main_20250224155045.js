const BASE_URL="https://api.themoviedb.org/3";
const API_KEY="4464a9cd6c3e0ee26ee5e6a893515421"
const POSTER_IMAGE="https://media.themoviedb.org/t/p/w440_and_h660_face";

async function fetchMovies() {
  try {
      const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);
      const data = await response.json();
console.log("Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia corporis distinctio asperiores aspernatur velit perferendis culpa eos quod temporibus dolorum. Ipsum quae vitae qui mollitia quas expedita sed atque quia?");

      const moviesContainer = document.getElementById("movie_container");
      moviesContainer.innerHTML = ""; // Clear existing content

      data.results.forEach(movie => {
          const movieCard = document.createElement("div");
          movieCard.classList.add("movie-card");

          movieCard.innerHTML = `
              <img src="${IMAGE_URL + movie.poster_path}" alt="${movie.title}">
              <h3>${movie.title}</h3>
              <p>⭐ ${movie.vote_average}</p>
          `;

          moviesContainer.appendChild(movieCard);
      });

  } catch (error) {
      console.error("Error fetching movies:", error);
  }
}
fetchMovies();

