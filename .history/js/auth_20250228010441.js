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