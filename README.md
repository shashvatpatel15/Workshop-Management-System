# Campus Workshop Hub 🎓

<!-- Add a sleek banner image if you have one -->
<!-- ![Campus Workshop Hub Banner](https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop) -->

**Campus Workshop Hub** is a premium, full-stack workshop management ecosystem designed for modern college campuses. It empowers student organizations to seamlessly create, manage, and promote workshops while providing students with a centralized discovery platform and a personalized learning dashboard.

Built with a focus on high-end aesthetics (**Glassmorphism**, **Framer Motion animations**) and robust performance (**Node.js**, **Firebase Firestore**).

---

## 🚀 Key Features

### For Students
- **Smart Discovery:** Powerful search and real-time filtering by club, topic, or timeline.
- **One-Click Registration:** Effortless signup with department and year-level tracking.
- **Personalized Analytics:** Visualize your learning journey with registration trends and topic distribution charts via `Chart.js`.
- **Hybrid Authentication:** Secure access via traditional email/password or **Google One-Tap Sign-In**.
- **Responsive Experience:** Fully optimized for mobile, tablet, and desktop browsing.

### For Organizers
- **Robust Management:** Create, update, and manage workshops with real-time capacity tracking.
- **Registrant Insights:** Access detailed lists of participants with their academic details and specific notes.
- **Platform Stats:** Real-time dashboard showing total reach, active workshops, and user growth.

### Technical Excellence
- **Centralized API:** RESTful architecture with structured error handling and JWT security.
- **Modern UI/UX:** Built with Tailwind CSS, featuring skeleton loaders, toast notifications, and smooth page transitions.
- **Scalable Backend:** leverages Firebase Admin SDK for reliable NoSQL data persistence.

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **Vite** (Ultra-fast HMR)
- **Tailwind CSS** (Utility-first styling)
- **Framer Motion** (Premium animations)
- **Chart.js** (Data visualization)
- **Lucide React** (Modern iconography)
- **Axios** (API communication with JWT interceptors)

### Backend
- **Node.js** + **Express.js** (RESTful API)
- **Firebase Firestore** (NoSQL Real-time Database)
- **Firebase Admin SDK** (Secure server-side operations)
- **JSON Web Token (JWT)** (Secure session management)
- **Bcrypt.js** (Industry-standard password hashing)

---

## 📂 Project Structure

```text
Workshop Management System/
├── backend/
│   ├── config/
│   │   ├── firebase.js        # Firebase Admin initialization
│   │   └── serviceAccountKey.json # Private Firebase credentials
│   ├── controllers/           # Business logic (Auth, Workshop, Registration)
│   ├── middlewares/           # JWT & error handling middleware
│   ├── routes/                # API endpoint definitions
│   └── server.js              # Express entry point
├── frontend/
│   ├── src/
│   │   ├── api/               # Axios instance configuration
│   │   ├── components/        # Predefined UI components
│   │   ├── context/           # Global State (Auth, Theme)
│   │   ├── hooks/             # Custom logic (useRegistrations, etc.)
│   │   ├── pages/             # View components (Home, Hub, Analytics)
│   │   └── main.jsx           # Client entry point
│   ├── public/                # Static assets
│   └── tailwind.config.js     # Design system configuration
└── README.md
```

---

## 🏁 Getting Started

### Prerequisites
- **Node.js** (v18.x recommended)
- **npm** or **yarn**
- **Firebase Account:** Create a project in the [Firebase Console](https://console.firebase.google.com/).

### Installation

1. **Clone the project**
   ```bash
   git clone https://github.com/shashvatpatel15/Workshop-Management-System.git
   cd Workshop-Management-System
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   - Download your **Service Account Key** (JSON) from *Firebase Project Settings > Service Accounts*.
   - Save it as `backend/config/serviceAccountKey.json`.

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

---

## 🔐 Environment Variables

Create `.env` files in both directories to connect the services.

### 📡 Backend (`/backend/.env`)
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_super_secret_key_here
```

### 🎨 Frontend (`/frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api

# Firebase Client SDK Config (For Google Sign-In)
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 🚀 Running the App

1. **Start Backend (Port 5000)**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend (Port 5173)**
   ```bash
   cd frontend
   npm run dev
   ```

---

## 🛣️ API Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Register new user | No |
| `POST` | `/api/auth/login` | Email/Password login | No |
| `GET` | `/api/workshops` | List all workshops | No |
| `GET` | `/api/workshops/stats` | Platform statistics | No |
| `GET` | `/api/workshops/:id` | Detailed workshop view | No |
| `POST` | `/api/registrations` | Register for workshop | **Yes** |
| `GET` | `/api/users/profile` | Get current user data | **Yes** |

---

## 📝 License
This project is for educational purposes. Feel free to use and modify for your own hackathons or learning!

---
*Created by [Shashvat Patel](https://github.com/shashvatpatel15)*
