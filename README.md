# 🎓 Workshop Management System

![React](https://img.shields.io/badge/Frontend-React-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![Express](https://img.shields.io/badge/API-Express-black)
![Firebase](https://img.shields.io/badge/Database-Firebase-orange)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

A **full-stack web application** that enables college clubs to organize workshops and allows students to explore, register, and track events happening in their college.

This project demonstrates **modern full-stack development practices**, including authentication, REST APIs, cloud database integration, and deployment.

---

# 🌐 Live Deployment

Frontend deployed on **Vercel**
Backend deployed on **Render**
Database powered by **Firebase Firestore**

Example architecture:

User → React Frontend → Express API → Firebase Firestore

---

# ✨ Key Features

## 👨‍🎓 Student Features

* Explore upcoming workshops
* Search workshops by title or club
* Register for workshops
* View personal registrations
* Track participation analytics
* Manage user profile

## 🧑‍🏫 Organizer Features

* Create new workshops
* Edit workshop details
* Delete workshops
* View workshop participants
* Track workshop statistics

## 🔐 Platform Features

* Secure **JWT authentication**
* Password hashing with **bcrypt**
* RESTful API architecture
* Responsive UI
* Modern dashboard interface

---

# 🛠 Tech Stack

## Frontend

* React
* Vite
* Tailwind CSS
* React Router
* Axios
* Chart.js
* Framer Motion

## Backend

* Node.js
* Express.js
* Firebase Admin SDK
* JWT Authentication
* bcrypt
* cors
* dotenv

## Database

* Firebase Firestore

---

# 🏗 System Architecture

```
User
 ↓
Frontend (React + Vite)
 ↓
Backend API (Node.js + Express)
 ↓
Firebase Firestore
```

Deployment setup:

Frontend → Vercel
Backend → Render
Database → Firebase

---

# 📂 Project Structure

```
Workshop-Management-System
│
├── backend
│   ├── config
│   │   └── firebase.js
│   │
│   ├── controllers
│   │   ├── authController.js
│   │   ├── workshopController.js
│   │   ├── registrationController.js
│   │   └── userController.js
│   │
│   ├── middlewares
│   │   └── authMiddleware.js
│   │
│   ├── routes
│   │   ├── authRoutes.js
│   │   ├── workshopRoutes.js
│   │   ├── registrationRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend
│   ├── src
│   │   ├── api
│   │   │   └── axios.js
│   │   ├── components
│   │   ├── context
│   │   ├── hooks
│   │   ├── pages
│   │   ├── utils
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

# ⚙️ Environment Variables

## Backend `.env`

Create a `.env` file inside `backend`:

```
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_secure_secret

FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
```

Add to `.gitignore`:

```
.env
```

---

# 🔥 Firebase Configuration

`backend/config/firebase.js`

```javascript
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

# 🚀 Running Locally

## Install dependencies

Backend

```
cd backend
npm install
```

Frontend

```
cd frontend
npm install
```

---

## Start Backend

```
npm start
```

Server runs on

```
http://localhost:5000
```

---

## Start Frontend

```
npm run dev
```

Application runs on

```
http://localhost:5173
```

---

# 📡 API Endpoints

## Authentication

| Method | Endpoint         | Description       |
| ------ | ---------------- | ----------------- |
| POST   | /api/auth/signup | Register new user |
| POST   | /api/auth/login  | Login user        |

---

## Workshops

| Method | Endpoint           | Description       |
| ------ | ------------------ | ----------------- |
| GET    | /api/workshops     | Get all workshops |
| POST   | /api/workshops     | Create workshop   |
| GET    | /api/workshops/:id | Get workshop      |
| PUT    | /api/workshops/:id | Update workshop   |
| DELETE | /api/workshops/:id | Delete workshop   |

---

## Registrations

| Method | Endpoint               | Description            |
| ------ | ---------------------- | ---------------------- |
| POST   | /api/registrations     | Register for workshop  |
| GET    | /api/registrations/me  | Get user registrations |
| DELETE | /api/registrations/:id | Cancel registration    |

---

## User

| Method | Endpoint           | Description    |
| ------ | ------------------ | -------------- |
| GET    | /api/users/profile | Get profile    |
| PUT    | /api/users/profile | Update profile |
| DELETE | /api/users/profile | Delete account |

---

# 🔒 Security

* JWT authentication
* Password hashing using bcrypt
* Protected API routes
* Environment variables for secrets
* Firebase admin authentication
