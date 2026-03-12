# 🎓 Workshop Hub — College Workshop Management System

A full-stack web application that helps college clubs create, manage, and announce workshops while enabling students to discover, register, and track their learning journey — all in one place.

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite, Tailwind CSS, Framer Motion, Chart.js |
| **Backend** | Node.js + Express.js, JWT Authentication |
| **Database** | MySQL with mysql2/promise |
| **Styling** | Tailwind CSS + Custom Design System |

## ✨ Features

### For Students (Colleagues)
- 🔍 **Smart Search & Filters** — Search by title, club, topic, or description; filter by date, organization, and topic tags
- 📋 **Workshop Discovery** — Browse workshops in grid or list view with real-time capacity tracking
- 📝 **One-Click Registration** — Register for workshops with department, year, and custom notes
- 📊 **Personal Analytics** — Track your registration history and activity over time with interactive charts
- 👤 **Profile Management** — Update name, email, password, or delete account

### For Organizers
- ➕ **Create Workshops** — Full workshop creation with title, description, date, time, location, capacity, level, and topics  
- ✏️ **Edit & Manage** — Update workshop details or delete workshops  
- 👥 **View Registrants** — See who registered with their details, department, year, and notes  
- 📈 **Organizer Analytics** — Capacity fill rates, topic distribution charts  

### Platform-Wide
- 🔐 **JWT Authentication** — Secure login and signup with role-based access control
- 📱 **Fully Responsive** — Mobile hamburger menu, optimized layouts for all screen sizes
- ⚡ **Real-Time Stats** — Live workshop count, member count, and registration stats on homepage
- 🎨 **Premium UI** — Glassmorphism, smooth animations, skeleton loaders, toast notifications
- 🔗 **Shareable Workshop Links** — Each workshop has a dedicated detail page with share functionality
- 🛡️ **Protected Routes** — Role-based access control for organizer and user features

## 📁 Project Structure

```
Workshop Management System/
├── backend/
│   ├── config/db.js           # MySQL connection pool
│   ├── controllers/           # Auth, Workshop, Registration, User controllers
│   ├── middlewares/           # JWT auth middleware
│   ├── routes/                # API route definitions
│   ├── database.sql           # Database schema
│   ├── seed.js                # Demo data seeder
│   └── server.js              # Express server entry point
│
├── frontend/
│   ├── src/
│   │   ├── api/axios.js       # Axios instance with JWT interceptor
│   │   ├── components/        # TopBar, Footer, WorkshopCard, RegistrationModal, etc.
│   │   ├── context/           # AuthContext for global auth state
│   │   ├── hooks/             # useRegistrations, useOrganizedWorkshops
│   │   ├── pages/             # HomePage, Login, Signup, Profile, Analytics, etc.
│   │   ├── utils/             # Date formatting utilities
│   │   └── styles.css         # Global styles + Tailwind
│   └── index.html             # Entry HTML with SEO meta tags
│
└── README.md
```

## 🛠️ Setup & Installation

### Prerequisites
- **Node.js** (v16+)
- **MySQL** (v8+)

### 1. Database Setup
```sql
-- Run the SQL file in MySQL Workbench or CLI
source backend/database.sql;
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file (or edit the existing one):
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=workshop_management
JWT_SECRET=your_secret_key_here
```

Seed demo data (optional):
```bash
node seed.js
```

Start the server:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The app will be running at `http://localhost:5173`

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | ❌ | Create new account |
| POST | `/api/auth/login` | ❌ | Login |
| GET | `/api/workshops` | ❌ | Get all workshops |
| GET | `/api/workshops/stats` | ❌ | Get platform stats |
| GET | `/api/workshops/:id` | ❌ | Get single workshop |
| POST | `/api/workshops` | ✅ | Create workshop |
| PUT | `/api/workshops/:id` | ✅ | Update workshop |
| DELETE | `/api/workshops/:id` | ✅ | Delete workshop |
| GET | `/api/workshops/:id/registrants` | ✅ | Get registrants |
| POST | `/api/registrations` | ✅ | Register for workshop |
| GET | `/api/registrations/me` | ✅ | My registrations |
| DELETE | `/api/registrations/:id` | ✅ | Deregister |
| GET | `/api/users/profile` | ✅ | Get profile |
| PUT | `/api/users/profile` | ✅ | Update profile |
| DELETE | `/api/users/profile` | ✅ | Delete account |
| GET | `/api/health` | ❌ | Health check |

## 🎯 Demo Credentials

After running `node seed.js`, sign up with any email to get started. Use `organizer` role to access workshop creation features.

## 📄 License

Built for a hackathon project. MIT License.
