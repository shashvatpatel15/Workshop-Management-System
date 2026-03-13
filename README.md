# Workshop Management System

<!-- Optional: Add a screenshot or GIF demo here -->
<!-- ![Workshop Management System Demo](link-to-your-screenshot.png) -->

## Table of Contents

*   [Overview](#overview)
*   [Features](#features)
    *   [Frontend](#frontend)
    *   [Backend](#backend)
*   [Tech Stack](#tech-stack)
    *   [Frontend](#frontend-1)
    *   [Backend](#backend-1)
*   [Project Structure](#project-structure)
*   [Getting Started](#getting-started)
    *   [Prerequisites](#prerequisites)
    *   [Installation](#installation)
    *   [Firebase Setup](#firebase-setup)
    *   [Environment Variables](#environment-variables)
    *   [Running Locally](#running-locally)
*   [API Endpoints Overview](#api-endpoints-overview)
*   [Deployment](#deployment)

## Overview

Workshop Management System is a full-stack web application that helps college clubs create, manage, and announce workshops while enabling students to discover, register, and track their learning journey. It features a responsive user interface with modern design, built using React and Tailwind CSS, communicating with a robust Node.js/Express backend API connected to Firebase Firestore.

## Features

### Frontend

*   **Dashboard:** Overview of key metrics (workshops, registrations), real-time stats, and user activity.
*   **Workshop Discovery:** Browse workshops in grid or list view with search and filtering by title, club, topic, or description.
*   **Registration System:** One-click registration for workshops with department, year, and custom notes.
*   **Personal Analytics:** Track registration history and activity over time with interactive charts.
*   **Profile Management:** View and update user profile details, including name, email, and password.
*   **Organizer Tools:** Create, edit, and manage workshops; view registrants with their details.
*   **Authentication:** Secure JWT-based login and signup with role-based access control.
*   **Responsive Design:** UI adapts to different screen sizes (desktop, tablet, mobile).
*   **Modern UI:** Glassmorphism effects, smooth animations, skeleton loaders, and toast notifications.

### Backend

*   **RESTful API:** Built with Express.js and Node.js.
*   **Authentication & Authorization:** JWT-based authentication middleware to protect routes. Handles user registration and login.
*   **Database:** Firebase Firestore for data storage and real-time updates.
*   **CRUD Operations:** API endpoints for managing Workshops, Registrations, and User Profiles.
*   **Error Handling:** Centralized error handling middleware.
*   **Environment Variables:** Configuration managed via `.env` files.

## Tech Stack

### Frontend

*   **React:** JavaScript library for building user interfaces.
*   **Vite:** Build tool for fast development and optimized production builds.
*   **Tailwind CSS:** Utility-first CSS framework for styling.
*   **React Context API:** For global state management (Authentication).
*   **Chart.js & react-chartjs-2:** For data visualization (charts in analytics).
*   **Framer Motion:** For smooth animations and transitions.
*   **Axios:** For making HTTP requests to the backend.
*   **React Router:** For client-side routing.

### Backend

*   **Node.js:** JavaScript runtime environment.
*   **Express.js:** Web framework for Node.js.
*   **Firebase Admin SDK:** For server-side Firebase authentication and Firestore access.
*   **Firebase Firestore:** NoSQL database for real-time data.
*   **JSON Web Token (JWT):** For generating authentication tokens.
*   **bcrypt:** For password hashing.
*   **cors:** Middleware for enabling Cross-Origin Resource Sharing.
*   **dotenv:** For loading environment variables from `.env` files.

## Project Structure

```
Workshop Management System/
├── backend/
│   ├── config/
│   │   ├── firebase.js             # Firebase Admin SDK initialization
│   │   └── serviceAccountKey.json  # Firebase service account key (⚠️ DO NOT COMMIT)
│   ├── controllers/           # Auth, Workshop, Registration, User controllers
│   ├── middlewares/           # JWT authentication middleware
│   ├── routes/                # API route definitions
│   ├── server.js              # Express server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js       # Axios instance with JWT interceptor
│   │   ├── components/        # Reusable UI components (TopBar, Footer, WorkshopCard, etc.)
│   │   ├── context/           # React Context files (AuthContext)
│   │   ├── hooks/             # Custom hooks (useRegistrations, useOrganizedWorkshops)
│   │   ├── pages/             # Page-level components (HomePage, LoginPage, etc.)
│   │   ├── utils/             # Date formatting utilities
│   │   ├── styles.css         # Global styles + Tailwind
│   │   ├── App.jsx            # Main application component with routing
│   │   └── main.jsx           # Entry point
│   ├── index.html             # Entry HTML with SEO meta tags
│   ├── package.json
│   ├── vite.config.js         # Vite configuration
│   ├── tailwind.config.js     # Tailwind configuration
│   └── postcss.config.js      # PostCSS configuration
└── README.md
```

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

*   **Node.js:** v16.x or later recommended (Ensure npm is also installed).
*   **Firebase Project:** A Firebase project with Firestore enabled.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    ```

2.  **Install Backend Dependencies:**
    ```bash
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies:**
    ```bash
    cd ../frontend
    npm install
    ```

### Firebase Setup

This project uses the **Firebase Admin SDK** on the backend, which requires a service account key for authentication.

#### Step 1 — Create a Firebase Project

1.  Go to [Firebase Console](https://console.firebase.google.com/) and click **Add project**.
2.  Follow the prompts to create your project.
3.  Once created, navigate to **Build → Firestore Database** and click **Create database**.
4.  Choose **Start in test mode** for development, then select a region and click **Done**.

#### Step 2 — Generate a Service Account Key

1.  In the Firebase Console, click the ⚙️ **gear icon** next to *Project Overview* → **Project settings**.
2.  Go to the **Service accounts** tab.
3.  Click **Generate new private key** → **Generate key**.
4.  A JSON file will be downloaded automatically — this is your service account key.

#### Step 3 — Add the Key to the Project

1.  Rename the downloaded file to `serviceAccountKey.json`.
2.  Place it inside the `backend/config/` directory:

    ```
    backend/
    └── config/
        ├── firebase.js
        └── serviceAccountKey.json   ← place it here
    ```

3.  **Important:** This file contains sensitive credentials. Make sure it is listed in `.gitignore` and **never committed to version control**:

    ```gitignore
    # .gitignore
    backend/config/serviceAccountKey.json
    ```

#### Step 4 — Verify `firebase.js`

Ensure your `backend/config/firebase.js` looks like this:

```js
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = { admin, db };
```

### Environment Variables

Environment variables are required for both the frontend and backend. Create `.env` files in the respective directories and add the necessary variables.

**1. Backend (`backend/.env`):**

   Create a `.env` file in the `/backend` directory:

   ```env
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   JWT_SECRET=<your_strong_jwt_secret>
   ```

   *   Replace `<your_strong_jwt_secret>` with a secure, random string for signing JWTs.

**2. Frontend (`frontend/.env`):**

   Create a `.env` file in the `/frontend` directory:

   ```env
   REACT_APP_API_BASE_URL=http://localhost:5000
   ```

   *   This should point to where your backend server is running. Use `http://localhost:5000` for local development.

### Running Locally

1.  **Start the Backend Server:**
    ```bash
    cd backend
    npm start
    ```
    The backend server should start, typically on port 5000 (or the one specified in `backend/.env`).

2.  **Start the Frontend Development Server:**
    Open a *new* terminal window/tab.
    ```bash
    cd frontend
    npm run dev
    ```
    The frontend development server should start, typically on port 5173, and open the application in your browser.

## API Endpoints Overview

The backend provides the following main API routes:

*   `/api/auth/signup`: (POST) Create a new user account.
*   `/api/auth/login`: (POST) Log in a user, returns JWT.
*   `/api/workshops`: (GET, POST) Get all workshops or create a new workshop.
*   `/api/workshops/:id`: (GET, PUT, DELETE) Get, update, or delete a specific workshop.
*   `/api/workshops/stats`: (GET) Get platform statistics.
*   `/api/workshops/:id/registrants`: (GET) Get registrants for a specific workshop.
*   `/api/registrations`: (POST) Register for a workshop.
*   `/api/registrations/me`: (GET) Get user's registrations.
*   `/api/registrations/:id`: (DELETE) Deregister from a workshop.
*   `/api/users/profile`: (GET, PUT, DELETE) Get, update, or delete user profile.
*   `/api/health`: (GET) Health check endpoint.

*(Note: Protected routes require JWT authentication).*

## Deployment

The frontend can be deployed to Vercel or any hosting service. The backend can be deployed to services like Railway, Render or any Node.js hosting platform. Ensure to set the environment variables in your deployment environment.

> ⚠️ **For deployment:** Do not upload `serviceAccountKey.json` to your hosting platform. Instead, use environment variables. Set `FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`, and `FIREBASE_CLIENT_EMAIL` in your deployment environment and update `firebase.js` to read from `process.env` instead of the JSON file.
