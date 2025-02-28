export function MovieCard(movie, index) {
  return `
<div class="movie-card">
    <div class="image-container">
        <img src="${IMAGE_URL + movie.poster_path}" alt="${movie.title}">
        <div class="overlay"></div>
        <div class="rating"><i class="fa-solid fa-star"></i> ${movie.vote_average.toFixed(
          1
        )}</div>
    </div>
    ${
      index % 3 == 0 ? '<div class="top-badge">TOP 10</div>' : ""
    } <!-- Show TOP 10 only for the first 10 movies -->
</div>
<div class="movie-title">${movie.title}</div>
`;
}
e