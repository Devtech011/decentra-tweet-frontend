
# Decentra Tweet Frontend

## Overview

This project is a decentralized (or “decentra”) Tweet–like frontend application built using React (and TypeScript). It allows users to post, view, comment, and like “tweets” (posts) (and optionally, to manage their profile) – all while leveraging a blockchain (or decentralized) backend (for example, via a smart contract or a decentralized API). The UI is modern, responsive, and user–friendly.

## Setup Instructions

1. Clone the repository (e.g., using `git clone <repo-url>`).
2. Install dependencies (if you use npm, run `npm install`; if you use yarn, run `yarn install`).
3. (Optional) Configure your environment (for example, set up a `.env` file with your API keys or backend endpoint).
4. Start the development server (e.g., run `npm start` or `yarn start`).
5. Open your browser (or a tool like Cursor) and navigate to (for example) `http://localhost:3000`.

## How to Use the Application

- **Home (PostList) Page:**  
  – On the home page, you’ll see a list of “tweets” (posts).  
  – A “New Post” button (top–right) lets you compose a new post (which opens a modal).  
  – A “Back” button (top–left) (using navigate(-1)) lets you return to the previous page.  
  – Click on a post’s “View” option (or “Comments”) to see its details (or to add comments).  
  – (Optional) You can “like” a post (or delete your own post) via the dropdown menu.

- **Post Detail Page:**  
  – Displays the full post (including its content, author, timestamp, and “likes”).  
  – Below the post, a paginated list of comments is shown (with a “scroller” if there are many).  
  – (Optional) You can add a comment (or “like” the post) if you’re logged in.

- **Profile Page:**  
  – (If implemented) A “Profile” page (or modal) lets you view (or update) your profile (e.g., username, bio, and profile picture).  
  – (Optional) A “Back” button (or “Back to Home”) is provided to return to the home page.

## Technologies Used

- **Frontend:**  
  – React (with TypeScript)  
  – (Optional) Tailwind CSS (for styling)  
  – (Optional) React Router (for navigation)  
  – (Optional) React Hot Toast (for notifications)  
  – (Optional) (or any other UI library or state–management tool (e.g., Redux, Context API) if used)

- **Backend (or “Decentralized” Backend):**  
  – (Optional) A smart contract (or a decentralized API) (for example, using Solidity, Web3, or a “decentralized” database)  
  – (Optional) (or a “mock” backend (e.g., a JSON server) for development)

## Completed Features

- **Post List (Home Page):**  
  – A responsive grid (or list) of “tweets” (posts) (with “like” and “comment” counts).  
  – A “New Post” button (and modal) to compose a new post.  
  – A “Back” button (using navigate(-1)) (for easy navigation).  
  – (Optional) Pagination (or “load more”) (if the backend is paginated).

- **Post Detail Page:**  
  – A full–size (or “expanded”) view of a post (with its “likes” (and “usernames” (if available))).  
  – A “scroller” (or “infinite” list) for comments (so that only a few (e.g., two) comments are shown initially).  
  – (Optional) A “Back” button (or “Back to Home”) (for navigation).

- **Profile Page (Optional):**  
  – (If implemented) A “Profile” card (or modal) (with (or without) a “Back” button) (to view (or update) your profile (e.g., username, bio, and profile picture)).

- **UI Enhancements (Optional):**  
  – (Optional) (or “modern” UI (e.g., gradient backgrounds, blur, shadows, transitions, etc.) (for a “beautiful” (or “modern”) UX)).