document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("navbar-container").innerHTML = getNavBar(); // Make sure the page has <div id="nav-container"></div>

  // Now select buttons after navbar is added
  const signUpBtn = document.querySelector("#sign-up");
  const logOutBtn = document.querySelector("#log-out");

  if (localStorage.getItem("user") !== null) {
    signUpBtn.style.display = "none";
    console.log("User is logged in, hiding Sign Up button.");
  } else {
    logOutBtn.style.display = "none";
    console.log("User is logged out, hiding Logout button.");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  let signupForm = document.getElementById("signupForm");
  let loginForm = document.getElementById("loginForm");

  function isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Function to validate password strength
  function isValidPassword(password) {
      return password.length >= 8 && /\d/.test(password); 
  }

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

          if (!isValidEmail(email)) {
              alert("Invalid email format! Please enter a valid email.");
              return;
          }

          if (!isValidPassword(password)) {
              alert("Password must be at least 8 characters long and contain a number.");
              return;
          }

          let hashedPassword = await hashPassword(password);

          // Store user data in local Storage securely
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
