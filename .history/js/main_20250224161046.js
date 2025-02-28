const API_KEY = '4464a9cd6c3e0ee26ee5e6a893515421'; // Replace with your TMDB API key
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w440_and_h660_face'; // Adjusted for the requested image size

async function fetchMovies() {
    try {
        const response = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=en-US&page=`);
        const data = await response.json();

        const moviesGrid = document.querySelector(".movies_grid");
        moviesGrid.innerHTML = ""; // Clear existing content

        data.results.forEach((movie, index) => {
            const movieCard = document.createElement("div");
            movieCard.classList.add("col-md-3", "col-sm-6", "col-lg-2", "movie_container");

            movieCard.innerHTML = `
                <div class="movie-card">
                    <div class="image-container">
                        <img src="${IMAGE_URL + movie.poster_path}" alt="${movie.title}">
                        <div class="overlay"></div>
                        <div class="rating"><i class="fa-solid fa-star"></i> ${movie.vote_average.toFixed(1)}</div>
                    </div>
                    ${index < 10 ? '<div class="top-badge">TOP 10</div>' : ''} <!-- Show TOP 10 only for the first 10 movies -->
                </div>
                <div class="movie-title">${movie.title}</div>
            `;

            moviesGrid.appendChild(movieCard);
        });

    } catch (error) {
        console.error("Error fetching movies:", error);
    }
}

fetchMovies();
