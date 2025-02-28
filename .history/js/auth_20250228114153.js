document.addEventListener("DOMContentLoaded", function () {
  let signupForm = document.getElementById("signupForm");
  let loginForm = document.getElementById("loginForm");

  // Function to validate email format
  function isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Function to validate password strength
  function isValidPassword(password) {
      return password.length >= 8 && /\d/.test(password); // At least 8 characters & contains a number
  }

  // Function to hash the password using SHA-256
  async function hashPassword(password) {
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hash = await crypto.subtle.digest("SHA-256", data);
      return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
  }

  // Signup Form Handling
  if (signupForm) {
      signupForm.addEventListener("submit", async function (event) {
          event.preventDefault();

          let name = document.getElementById("signupName").value;
          let email = document.getElementById("signupEmail").value;
          let password = document.getElementById("signupPassword").value;

          // Validate inputs
          if (!isValidEmail(email)) {
              alert("Invalid email format! Please enter a valid email.");
              return;
          }

          if (!isValidPassword(password)) {
              alert("Password must be at least 8 characters long and contain a number.");
              return;
          }

          // Hash the password before storing
          let hashedPassword = await hashPassword(password);

          // Store user data in localStorage securely
          localStorage.setItem("user", JSON.stringify({ name, email, password: hashedPassword }));

          alert("Signup successful! Redirecting to login...");
          window.location.href = "login.html"; 
      });
  }

  if (loginForm) {
      loginForm.addEventListener("submit", async function (event) {
          event.preventDefault();

          let email = document.getElementById("loginEmail").value;
          let password = document.getElementById("loginPassword").value;

          let storedUser = JSON.parse(localStorage.getItem("user"));

          if (!storedUser) {
              alert("No account found! Please sign up first.");
              return;
          }

          let hashedPassword = await hashPassword(password);

          if (storedUser.email === email && storedUser.password === hashedPassword) {
              alert("Login successful! Redirecting to Home Page...");
              window.location.href = "../screens/index.html";
          } else {
              alert("Invalid email or password!");
          }
      });
  }
});
