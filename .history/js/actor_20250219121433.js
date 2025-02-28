document.getElementById('dropdown').addEventListener('mouseenter', function() {
  document.querySelector('.dropdown-menu').style.display = 'block';  
});
document.getElementById('dropdown-menu').addEventListener('mouseenter', function() {
  document.querySelector('.dropdown-menu').style.display = 'block';  
});

document.getElementById('dropdown').addEventListener('mouseleave', function() {
    document.querySelector('.dropdown-menu').style.display = 'none';
});