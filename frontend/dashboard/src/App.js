import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';

// Import Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Integrations from './pages/Integrations';
import FocusTimer from './pages/FocusTimer';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes with Layout */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <div className="app-layout">
                  <Navigation />
                  <main className="main-content">
                    <Dashboard />
                  </main>
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="/tasks" element={
              <ProtectedRoute>
                <div className="app-layout">
                  <Navigation />
                  <main className="main-content">
                    <Tasks />
                  </main>
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="/integrations" element={
              <ProtectedRoute>
                <div className="app-layout">
                  <Navigation />
                  <main className="main-content">
                    <Integrations />
                  </main>
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="/focus" element={
              <ProtectedRoute>
                <div className="app-layout">
                  <Navigation />
                  <main className="main-content">
                    <FocusTimer />
                  </main>
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="/reports" element={
              <ProtectedRoute>
                <div className="app-layout">
                  <Navigation />
                  <main className="main-content">
                    <Reports />
                  </main>
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute>
                <div className="app-layout">
                  <Navigation />
                  <main className="main-content">
                    <Settings />
                  </main>
                </div>
              </ProtectedRoute>
            } />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;