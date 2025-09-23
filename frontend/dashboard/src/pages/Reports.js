import React, { useState, useEffect } from 'react';
import { tasksAPI } from '../utils/api';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import './Reports.css';

const Reports = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('week');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await tasksAPI.getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDateRange = () => {
    const now = new Date();
    switch (dateRange) {
      case 'week':
        return {
          start: startOfWeek(now),
          end: endOfWeek(now),
          label: 'This Week'
        };
      case 'month':
        return {
          start: startOfMonth(now),
          end: endOfMonth(now),
          label: 'This Month'
        };
      case '30days':
        return {
          start: subDays(now, 30),
          end: now,
          label: 'Last 30 Days'
        };
      default:
        return {
          start: startOfWeek(now),
          end: endOfWeek(now),
          label: 'This Week'
        };
    }
  };

  const { start, end, label } = getDateRange();
  
  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Weekly completion data (mock data for now)
  const weeklyData = [
    { day: 'Mon', completed: 3, created: 5 },
    { day: 'Tue', completed: 4, created: 3 },
    { day: 'Wed', completed: 2, created: 6 },
    { day: 'Thu', completed: 5, created: 2 },
    { day: 'Fri', completed: 3, created: 4 },
    { day: 'Sat', completed: 1, created: 2 },
    { day: 'Sun', completed: 2, created: 1 }
  ];

  const maxValue = Math.max(...weeklyData.flatMap(d => [d.completed, d.created]));

  if (loading) {
    return (
      <div className="reports-container">
        <div className="loading">Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1>📈 Reports & Analytics</h1>
        <div className="date-filter">
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="date-select"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="30days">Last 30 Days</option>
          </select>
        </div>
      </div>

      <div className="reports-grid">
        {/* Key Metrics */}
        <div className="metrics-section">
          <div className="section-header">
            <h3>📊 Key Metrics ({label})</h3>
          </div>
          
          <div className="metrics-cards">
            <div className="metric-card">
              <div className="metric-icon">�</div>
              <div className="metric-value">{totalTasks}</div>
              <div className="metric-label">Total Tasks</div>
            </div>
            
            <div className="metric-card success">
              <div className="metric-icon">✅</div>
              <div className="metric-value">{completedTasks}</div>
              <div className="metric-label">Completed</div>
            </div>
            
            <div className="metric-card warning">
              <div className="metric-icon">⏳</div>
              <div className="metric-value">{pendingTasks}</div>
              <div className="metric-label">Pending</div>
            </div>
            
            <div className="metric-card info">
              <div className="metric-icon">📈</div>
              <div className="metric-value">{completionRate}%</div>
              <div className="metric-label">Completion Rate</div>
            </div>
          </div>
        </div>

        {/* Progress Chart */}
        <div className="chart-section">
          <div className="section-header">
            <h3>📊 Weekly Activity</h3>
          </div>
          
          <div className="chart-container">
            <div className="chart">
              {weeklyData.map((day, index) => (
                <div key={day.day} className="chart-bar-group">
                  <div className="chart-bars">
                    <div 
                      className="chart-bar completed"
                      style={{ height: `${(day.completed / maxValue) * 100}%` }}
                      title={`Completed: ${day.completed}`}
                    ></div>
                    <div 
                      className="chart-bar created"
                      style={{ height: `${(day.created / maxValue) * 100}%` }}
                      title={`Created: ${day.created}`}
                    ></div>
                  </div>
                  <div className="chart-label">{day.day}</div>
                </div>
              ))}
            </div>
            
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color completed"></div>
                <span>Tasks Completed</span>
              </div>
              <div className="legend-item">
                <div className="legend-color created"></div>
                <span>Tasks Created</span>
              </div>
            </div>
          </div>
        </div>

        {/* Productivity Insights */}
        <div className="insights-section">
          <div className="section-header">
            <h3>💡 Productivity Insights</h3>
          </div>
          
          <div className="insights-list">
            <div className="insight-item">
              <div className="insight-icon">🎯</div>
              <div className="insight-content">
                <div className="insight-title">Great Progress!</div>
                <div className="insight-description">
                  You've completed {completionRate}% of your tasks. Keep up the good work!
                </div>
              </div>
            </div>
            
            <div className="insight-item">
              <div className="insight-icon">⚡</div>
              <div className="insight-content">
                <div className="insight-title">Most Productive Day</div>
                <div className="insight-description">
                  Thursday is your most productive day with an average of 5 completed tasks.
                </div>
              </div>
            </div>
            
            <div className="insight-item">
              <div className="insight-icon">�</div>
              <div className="insight-content">
                <div className="insight-title">Task Creation Pattern</div>
                <div className="insight-description">
                  You tend to create more tasks at the beginning of the week.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="export-section">
          <div className="section-header">
            <h3>📤 Export Data</h3>
          </div>
          
          <div className="export-options">
            <button className="export-btn">
              � Export as CSV
            </button>
            <button className="export-btn">
              📄 Generate PDF Report
            </button>
            <button className="export-btn">
              📈 Export Chart Data
            </button>
          </div>
          
          <div className="export-info">
            <p>Export your productivity data for external analysis or record keeping.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;