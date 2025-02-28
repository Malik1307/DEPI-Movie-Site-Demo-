document.getElementById("signupForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent page reload

  let name = document.getElementById("signupName").value;
  let email = document.getElementById("signupEmail").value;
  let password = document.getElementById("signupPassword").value;

  // Store user data in sessionStorage
  sessionStorage.setItem("user", JSON.stringify({ name, email, password }));

  alert("Signup successful! You can now login.");
  window.location.href = "login.html"; // Redirect to login page
});

document.getElementById("loginForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent page reload

  let email = document.getElementById("loginEmail").value;
  let password = document.getElementById("loginPassword").value;

  // Retrieve user data from sessionStorage
  let storedUser = JSON.parse(sessionStorage.getItem("user"));

  if (storedUser && storedUser.email === email && storedUser.password === password) {
      alert("Login successful!");
      window.location.href = "dashboard.html"; // Redirect to another page
  } else {
      alert("Invalid email or password!");
  }
});