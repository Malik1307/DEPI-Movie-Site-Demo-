document.addEventListener("DOMContentLoaded", function () {
  let signupForm = document.getElementById("signupForm");
  let loginForm = document.getElementById("loginForm");

  // Signup Form Handling
  if (signupForm) {
      signupForm.addEventListener("submit", function (event) {
          event.preventDefault();

          let name = document.getElementById("signupName").value;
          let email = document.getElementById("signupEmail").value;
          let password = document.getElementById("signupPassword").value;

          // Store user data in sessionStorage
          sessionStorage.setItem("user", JSON.stringify({ name, email, password }));

          alert("Signup successful! Redirecting to login...");
          window.location.href = "login.html"; // Redirect to login page
      });
  }

  // Login Form Handling
  if (loginForm) {
      loginForm.addEventListener("submit", function (event) {
          event.preventDefault();

          let email = document.getElementById("loginEmail").value;
          let password = document.getElementById("loginPassword").value;

          let storedUser = JSON.parse(sessionStorage.getItem("user"));

          if (storedUser && storedUser.email === email && storedUser.password === password) {
              alert("Login successful! Redirecting to dashboard...");
              window.location.href = ".html"; 
          } else {
              alert("Invalid email or password!");
          }
      });
  }
});
