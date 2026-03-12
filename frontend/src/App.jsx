import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import TopBar from "./components/TopBar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import MyRegistrationsPage from "./pages/MyRegistrationsPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import CreateWorkshopPage from "./pages/CreateWorkshopPage";
import EditWorkshopPage from "./pages/EditWorkshopPage";
import ProfilePage from "./pages/ProfilePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-shell" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <TopBar />
          <main className="main-content" style={{ flex: 1, paddingBottom: '40px' }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route
                path="/my-registrations"
                element={
                  <ProtectedRoute>
                    <MyRegistrationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-workshop"
                element={
                  <ProtectedRoute>
                    <CreateWorkshopPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-workshop/:id"
                element={
                  <ProtectedRoute>
                    <EditWorkshopPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <AnalyticsPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
