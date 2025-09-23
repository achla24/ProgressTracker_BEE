import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI, tasksAPI } from '../utils/api';
import { format, startOfDay, isToday } from 'date-fns';
import './Dashboard.css';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [dashResponse, tasksResponse] = await Promise.all([
        dashboardAPI.getDashboard(),
        tasksAPI.getTasks()
      ]);
      
      setDashboardData(dashResponse.data);
      setTasks(tasksResponse.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const recentTasks = tasks.slice(-5).reverse();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>📊 Dashboard</h1>
        <div className="date-info">
          {format(new Date(), 'EEEE, MMMM do, yyyy')}
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Stats Cards */}
        <div className="stats-section">
          <div className="stat-card primary">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <div className="stat-number">{totalTasks}</div>
              <div className="stat-label">Total Tasks</div>
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-number">{completedTasks}</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>

          <div className="stat-card warning">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <div className="stat-number">{pendingTasks}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>

          <div className="stat-card info">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <div className="stat-number">{completionRate}%</div>
              <div className="stat-label">Completion Rate</div>
            </div>
          </div>
        </div>

        {/* Progress Chart */}
        <div className="progress-section">
          <div className="section-header">
            <h3>📈 Progress Overview</h3>
          </div>
          <div className="progress-chart">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
            <div className="progress-text">
              {completedTasks} of {totalTasks} tasks completed
            </div>
          </div>
          
          <div className="progress-breakdown">
            <div className="breakdown-item">
              <div className="breakdown-color completed"></div>
              <span>Completed ({completedTasks})</span>
            </div>
            <div className="breakdown-item">
              <div className="breakdown-color pending"></div>
              <span>Pending ({pendingTasks})</span>
            </div>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="recent-tasks-section">
          <div className="section-header">
            <h3>📝 Recent Tasks</h3>
            <Link to="/tasks" className="view-all-link">View All</Link>
          </div>
          
          {recentTasks.length === 0 ? (
            <div className="no-tasks">
              <p>No tasks yet.</p>
              <Link to="/tasks" className="create-task-btn">Create your first task</Link>
            </div>
          ) : (
            <div className="tasks-preview">
              {recentTasks.map(task => (
                <div key={task.id} className={`task-preview ${task.completed ? 'completed' : ''}`}>
                  <div className="task-status">
                    {task.completed ? '✅' : '⬜'}
                  </div>
                  <div className="task-title">
                    {task.title}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-section">
          <div className="section-header">
            <h3>⚡ Quick Actions</h3>
          </div>
          
          <div className="action-buttons">
            <Link to="/tasks" className="action-btn primary">
              <div className="action-icon">📝</div>
              <div className="action-text">
                <div className="action-title">Manage Tasks</div>
                <div className="action-desc">Add, edit, or complete tasks</div>
              </div>
            </Link>

            <Link to="/integrations" className="action-btn secondary">
              <div className="action-icon">🔗</div>
              <div className="action-text">
                <div className="action-title">Integrations</div>
                <div className="action-desc">Connect external tools</div>
              </div>
            </Link>

            <Link to="/focus" className="action-btn accent">
              <div className="action-icon">⏰</div>
              <div className="action-text">
                <div className="action-title">Focus Timer</div>
                <div className="action-desc">Start a productivity session</div>
              </div>
            </Link>

            <Link to="/reports" className="action-btn info">
              <div className="action-icon">📊</div>
              <div className="action-text">
                <div className="action-title">View Reports</div>
                <div className="action-desc">Analyze your progress</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Integration Status */}
        <div className="integrations-status-section">
          <div className="section-header">
            <h3>🔗 Integration Status</h3>
          </div>
          
          <div className="integration-items">
            <div className="integration-item">
              <div className="integration-icon">📅</div>
              <div className="integration-info">
                <div className="integration-name">Google Calendar</div>
                <div className={`integration-status ${dashboardData?.googleCalendarConnected ? 'connected' : 'disconnected'}`}>
                  {dashboardData?.googleCalendarConnected ? '✅ Connected' : '❌ Not Connected'}
                </div>
              </div>
              <Link to="/integrations" className="integration-action">
                {dashboardData?.googleCalendarConnected ? 'Manage' : 'Connect'}
              </Link>
            </div>

            <div className="integration-item">
              <div className="integration-icon">📋</div>
              <div className="integration-info">
                <div className="integration-name">Todoist</div>
                <div className="integration-status connected">
                  ✅ Available
                </div>
              </div>
              <Link to="/integrations" className="integration-action">
                Sync
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;