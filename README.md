# CinePlex

CinePlex is a React movie discovery app for browsing trending films, searching titles, exploring genres, viewing movie details, watching trailers, and saving a personal watchlist. It uses Firebase Authentication for user accounts, Firestore for watchlist storage, and The Movie Database API for live movie data.

## Features

- Email/password sign up and login with Firebase Authentication
- Trending movie feed powered by TMDB
- Movie search by title
- Genre filtering for common categories
- Infinite scrolling movie grid
- Detailed movie pages with posters, backdrops, ratings, runtime, synopsis, cast, crew, trailers, and similar movies
- Actor pages with biography and filmography
- User watchlist saved to Firestore
- Profile page accessible from the avatar menu
- Responsive dark UI styled for a streaming-library experience

## Tech Stack

- React
- Create React App
- Firebase Authentication
- Cloud Firestore
- The Movie Database API
- CSS

## Getting Started

### Prerequisites

- Node.js
- npm
- Firebase project
- TMDB API key

### Installation

```bash
npm install
```

Create a `.env` file in the project root and add your TMDB key:

```env
REACT_APP_TMDB_KEY=your_tmdb_api_key
```

Update `src/firebase.js` with your Firebase project configuration if you are using a different Firebase project.

### Run Locally

```bash
npm start
```

Open `http://localhost:3000` in your browser.

### Build

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Project Structure

```text
src/
  components/        Reusable UI and page components
  context/           Authentication context
  data/              TMDB API helpers
  App.js             Main app state and page routing
  App.css            Global styling
  firebase.js        Firebase setup
```

## Repository Description

A React movie discovery app with Firebase authentication, Firestore watchlists, TMDB-powered search, genre browsing, trailers, actor pages, and user profiles.
