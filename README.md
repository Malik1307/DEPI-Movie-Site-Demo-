# Movies & Series Website

## Overview
This project is a **Movies & TV Series Website** developed as part of the **EYouth X DEPI Tech Challenge**. The website allows users to search, browse, and view details of movies and TV series. It is built using **Bootstrap** for frontend design and **JavaScript** for handling user authentication via **Local Storage or Cookies**.

## Features
### 1. **User Authentication**
- Users can **sign up** and **log in**.
- User data is securely stored in **Local Storage**.
- Passwords are hashed for basic security.

### 2. **Movie & Series Listing**
- Homepage displays a list of **trending movies and TV series**.
- Each movie/series is displayed with a **thumbnail, title, and brief description**.
- Users can navigate to **detailed pages** for more information.

### 3. **Movie & Series Details Page**
- Displays essential details such as:
  - **Title, Genre, Duration, Overview, Cast, Ratings**.
  - Embedded **YouTube trailer** for better user experience.
- Implemented using **Bootstrap Cards & Modals**.

### 4. **Search, Filtering & Sorting**
- **Search Feature** allows users to find movies & TV series.
- **Filtering** by genre and rating.
- **Sorting** options include title, release date, rating, and popularity.

### 5. **Responsive Design & User Experience Enhancements**
- Optimized for **mobile and desktop** using Bootstrap's grid system.
- Smooth **navigation and transitions** for better user experience.

---
## **Implementation Approach**
### **1. Frontend Development**
- Used **Bootstrap** for UI components.
- Implemented **responsive design** for cross-device compatibility.

### **2. User Authentication**
- Signup and login system built using **JavaScript & Local Storage**.
- **Validation & error handling** added for better security.

### **3. Fetching Movie Data**
- Integrated with **TMDB API** to fetch **real-time movie & series data**.
- Used **fetch() API** to retrieve details dynamically.

### **4. Interactive UI & Filtering**
- Implemented **search, filtering, and sorting** features.
- Used **modular JavaScript files** for maintainability.

### **5. Movie Details Page**
- Displayed **detailed information & embedded trailers**.
- Integrated **Watch Later** feature using Local Storage.

---
## **Project Structure**
```sh
📂 Project Root
├── 📂 assets          # Static files
│   ├── 📂 fonts       # Font files
│   ├── 📂 images      # Image assets
├── 📂 css             # Stylesheets
│   ├── actor.css
│   ├── auth.css
│   ├── browsing-category.css
│   ├── home.css
│   ├── movie-details.css
│   ├── responsive.css
│   ├── search-results.css
│   ├── styles.css
├── 📂 js              # JavaScript files
│   ├── auth.js       # User authentication
│   ├── search.js     # Search functionality
│   ├── actor.js      # Actor details page
│   ├── browse-category.js  # Filtering & browsing movies
│   ├── main.js       # Homepage logic (trending movies, carousel, etc.)
│   ├── movie-details.js # Fetching and displaying movie details
├── 📂 screens         # HTML pages
│   ├── actor.html
│   ├── browse-category.html
│   ├── index.html
│   ├── login.html
│   ├── movie-details.html
│   ├── register.html
│   ├── search-results.html
├── 📂 shared          # Shared JavaScript components
│   ├── components.js
│   ├── constants.js
├── package.json       # Project dependencies
├── The Report.txt     # Project report file
└── index.html        # Main entry point
