# 🎓 Workshop Management System

![React](https://img.shields.io/badge/Frontend-React-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![Express](https://img.shields.io/badge/API-Express-black)
![Firebase](https://img.shields.io/badge/Database-Firebase-orange)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

A **full-stack web application** designed to streamline workshop management in colleges. It enables organizers to create and manage events while allowing students to discover, register, and track their participation.

Built using **modern web technologies**, this project demonstrates scalable architecture, secure authentication, and real-world deployment practices.

---

# 🌐 Live Demo

🔗 **Live App:** https://workshop-connect.vercel.app/

### Deployment Overview

* **Frontend:** Vercel
* **Backend:** Render
* **Database:** Firebase Firestore

### Architecture Flow

```
User → React Frontend → Express API → Firebase Firestore
```

---

# ✨ Features

## 👨‍🎓 Student Features

* Browse upcoming workshops
* Search by title or organizing club
* Register for workshops
* View registered events
* Track participation analytics
* Manage profile

## 🧑‍🏫 Organizer Features

* Create workshops
* Update workshop details
* Delete workshops
* View participants
* Analyze workshop statistics

## 🔐 Platform Features

* JWT-based authentication
* Password hashing with bcrypt
* RESTful API design
* Responsive UI (mobile-friendly)
* Interactive dashboard with analytics

---

# 🛠 Tech Stack

## Frontend

* React (Vite)
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

* Firebase Firestore (NoSQL cloud database)

---

# 🏗 System Architecture

```
Client (Browser)
     ↓
Frontend (React + Vite)
     ↓
Backend (Node.js + Express)
     ↓
Firebase Firestore
```

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

Create a `.env` file inside the `backend` directory:

```
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_secure_secret

FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
```

### Important

* Replace `\n` correctly in private key (handled in code)
* Never commit `.env` file

Add to `.gitignore`:

```
.env
```

---

# 🔥 Firebase Setup

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

# 🚀 Getting Started

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/workshop-management-system.git
cd workshop-management-system
```

## 2️⃣ Install Dependencies

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

## 3️⃣ Run the Application

### Start Backend

```bash
npm start
```

Runs on:

```
http://localhost:5000
```

### Start Frontend

```bash
npm run dev
```

Runs on:

```
http://localhost:5173
```

---

# 📡 API Documentation

## 🔐 Authentication

| Method | Endpoint         | Description   |
| ------ | ---------------- | ------------- |
| POST   | /api/auth/signup | Register user |
| POST   | /api/auth/login  | Login user    |

## 📚 Workshops

| Method | Endpoint           | Description       |
| ------ | ------------------ | ----------------- |
| GET    | /api/workshops     | Get all workshops |
| POST   | /api/workshops     | Create workshop   |
| GET    | /api/workshops/:id | Get workshop      |
| PUT    | /api/workshops/:id | Update workshop   |
| DELETE | /api/workshops/:id | Delete workshop   |

## 📝 Registrations

| Method | Endpoint               | Description            |
| ------ | ---------------------- | ---------------------- |
| POST   | /api/registrations     | Register for workshop  |
| GET    | /api/registrations/me  | Get user registrations |
| DELETE | /api/registrations/:id | Cancel registration    |

## 👤 User

| Method | Endpoint           | Description      |
| ------ | ------------------ | ---------------- |
| GET    | /api/users/profile | Get user profile |
| PUT    | /api/users/profile | Update profile   |
| DELETE | /api/users/profile | Delete account   |

---

# 🔒 Security

* JWT-based authentication
* Password hashing using bcrypt
* Protected routes using middleware
* Environment variables for sensitive data
* Firebase Admin SDK security

---

# 🚀 Future Improvements

* Email notifications
* Role-based admin dashboard
* Workshop feedback & ratings
* Payment integration
* Real-time updates

---

# 📄 License

This project is licensed under the **MIT License**.
