function showDetails(movieElement) {
  let details = movieElement.querySelector('.movie-details');
  details.style.opacity = "1";
  details.style.visibility = "visible";
}

function hideDetails(movieElement) {
  let details = movieElement.querySelector('.movie-details');
  details.style.opacity = "0";
  details.style.visibility = "hidden";
}
