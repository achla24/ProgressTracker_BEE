import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navigation.css';

const Navigation = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <h2>🚀 ProgressTracker</h2>
        </div>

        <div className="nav-menu">
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            📊 Dashboard
          </NavLink>
          
          <NavLink 
            to="/tasks" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            📋 Tasks
          </NavLink>
          
          <NavLink 
            to="/integrations" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            🔗 Integrations
          </NavLink>
          
          <NavLink 
            to="/focus" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            ⏰ Focus Timer
          </NavLink>
          
          <NavLink 
            to="/reports" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            📈 Reports
          </NavLink>
        </div>

        <div className="nav-user">
          <div className="user-info">
            <span className="user-name">👋 {user?.email}</span>
          </div>
          <div className="nav-actions">
            <NavLink 
              to="/settings" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              ⚙️ Settings
            </NavLink>
            <button onClick={handleLogout} className="logout-button">
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;