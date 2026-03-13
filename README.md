# Workshop Management System

A **full-stack web application** that allows college clubs to create and manage workshops while enabling students to discover, register, and track their participation in events.

The platform provides a **modern dashboard, workshop discovery, registration system, and analytics**, helping both organizers and students manage academic events efficiently.

---

# Overview

The **Workshop Management System** is designed to simplify the organization of college workshops and student participation.

Students can:

* Browse upcoming workshops
* Register for events
* Track their registrations

Organizers can:

* Create and manage workshops
* View participants
* Analyze engagement statistics

The application uses a **React frontend**, **Node.js/Express backend**, and **Firebase Firestore database**.

---

# Features

## Student Features

* Browse upcoming workshops
* Search workshops by title, club, or topic
* Register for workshops
* View personal registration history
* Track activity using analytics charts
* Manage personal profile

## Organizer Features

* Create and manage workshops
* Edit or delete workshop details
* View workshop participants
* Monitor workshop statistics

## Platform Features

* Secure **JWT authentication**
* Role-based access control
* RESTful API architecture
* Responsive design for mobile and desktop
* Modern UI with animations and loaders

---

# Tech Stack

## Frontend

* **React** – UI development
* **Vite** – Fast build tool
* **Tailwind CSS** – Styling framework
* **React Router** – Routing
* **Axios** – API communication
* **Chart.js** – Analytics visualization
* **Framer Motion** – UI animations

## Backend

* **Node.js** – Runtime environment
* **Express.js** – Web framework
* **Firebase Admin SDK** – Firestore access
* **JWT (JSON Web Tokens)** – Authentication
* **bcrypt** – Password hashing
* **cors** – Cross-origin support
* **dotenv** – Environment variable management

## Database

* **Firebase Firestore** – NoSQL cloud database

---

# Architecture

Frontend, backend, and database are deployed on different platforms:

Frontend → Vercel
Backend → Render
Database → Firebase Firestore

Workflow:

User → Frontend (React) → Backend API (Express) → Firebase Firestore

This architecture allows **scalable deployment and independent service management**.

---

# Project Structure

```
Workshop-Management-System
│
├── backend
│   ├── config
│   │   └── firebase.js
│   ├── controllers
│   ├── middlewares
│   ├── routes
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend
│   ├── src
│   │   ├── api
│   │   ├── components
│   │   ├── context
│   │   ├── hooks
│   │   ├── pages
│   │   ├── utils
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# Getting Started

## Prerequisites

Make sure you have installed:

* Node.js (v16 or higher)
* npm or yarn
* A Firebase project with Firestore enabled

---

# Installation

## Clone the Repository

```
git clone https://github.com/your-username/workshop-management-system.git
```

---

## Install Backend Dependencies

```
cd backend
npm install
```

---

## Install Frontend Dependencies

```
cd ../frontend
npm install
```

---

# Firebase Setup

This project uses **Firebase Firestore** for storing workshop, user, and registration data.

### Step 1 — Create Firebase Project

1. Go to the Firebase Console
2. Click **Add Project**
3. Create a new project
4. Enable **Firestore Database**

---

### Step 2 — Generate Firebase Admin Credentials

1. Go to **Project Settings**
2. Open **Service Accounts**
3. Click **Generate New Private Key**

This will download a **service account JSON file**.

Do **not commit this file to GitHub**.

Instead, copy values from it into environment variables.

---

# Environment Variables

## Backend `.env`

Create a file:

```
backend/.env
```

Add the following variables:

```
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_super_secure_secret

FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
```

Important notes:

* Keep quotes around the private key
* Preserve `\n` characters
* Never commit `.env` to GitHub

Add to `.gitignore`:

```
.env
```

---

# Firebase Configuration

`backend/config/firebase.js`

```
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL
  })
});

const db = admin.firestore();

module.exports = { admin, db };
```

---

# Running the Application

## Start Backend Server

```
cd backend
npm start
```

Server will run on:

```
http://localhost:5000
```

---

## Start Frontend

Open another terminal:

```
cd frontend
npm run dev
```

Application will run on:

```
http://localhost:5173
```

---

# API Endpoints

### Authentication

POST `/api/auth/signup`
POST `/api/auth/login`

### Workshops

GET `/api/workshops`
POST `/api/workshops`
GET `/api/workshops/:id`
PUT `/api/workshops/:id`
DELETE `/api/workshops/:id`

### Registrations

POST `/api/registrations`
GET `/api/registrations/me`
DELETE `/api/registrations/:id`

### Users

GET `/api/users/profile`
PUT `/api/users/profile`
DELETE `/api/users/profile`

---

# Deployment

The application is deployed using:

Frontend → Vercel
Backend → Render
Database → Firebase Firestore

Steps:

1. Deploy frontend to Vercel
2. Deploy backend to Render
3. Add environment variables in Render
4. Connect backend API URL in frontend

---

# Security Notes

* Never commit `.env` files
* Never upload Firebase service account JSON files
* Use environment variables in production
* Always hash passwords using bcrypt
* Protect routes using JWT authentication
