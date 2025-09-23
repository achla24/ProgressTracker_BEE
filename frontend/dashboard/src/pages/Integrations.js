import React, { useState, useEffect } from 'react';
import { todoistAPI, googleAPI } from '../utils/api';
import './Integrations.css';

const Integrations = () => {
  const [todoistTasks, setTodoistTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState('idle');

  const handleTodoistSync = async () => {
    setLoading(true);
    setSyncStatus('syncing');
    try {
      const response = await todoistAPI.getTasks();
      setTodoistTasks(response.data);
      setSyncStatus('success');
    } catch (error) {
      console.error('Todoist sync failed:', error);
      setSyncStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCalendarConnect = () => {
    window.open('http://localhost:5000/google/auth', '_blank');
  };

  return (
    <div className="integrations-container">
      <div className="integrations-header">
        <h1>🔗 Integrations</h1>
        <p>Connect external tools to sync your productivity data</p>
      </div>

      <div className="integrations-grid">
        {/* Google Calendar Integration */}
        <div className="integration-card">
          <div className="integration-header">
            <div className="integration-icon">📅</div>
            <div className="integration-info">
              <h3>Google Calendar</h3>
              <p>Sync tasks as calendar events</p>
            </div>
            <div className="integration-status">
              <span className="status-badge disconnected">Not Connected</span>
            </div>
          </div>
          
          <div className="integration-content">
            <ul className="feature-list">
              <li>✅ Create calendar events from tasks</li>
              <li>✅ Set reminders and due dates</li>
              <li>✅ View tasks in calendar format</li>
            </ul>
            
            <button 
              className="integration-button primary"
              onClick={handleGoogleCalendarConnect}
            >
              Connect Google Calendar
            </button>
          </div>
        </div>

        {/* Todoist Integration */}
        <div className="integration-card">
          <div className="integration-header">
            <div className="integration-icon">📋</div>
            <div className="integration-info">
              <h3>Todoist</h3>
              <p>Two-way sync with your Todoist account</p>
            </div>
            <div className="integration-status">
              <span className="status-badge connected">Available</span>
            </div>
          </div>
          
          <div className="integration-content">
            <ul className="feature-list">
              <li>✅ Import existing Todoist tasks</li>
              <li>✅ Create new tasks in Todoist</li>
              <li>✅ Mark tasks complete</li>
            </ul>
            
            <div className="sync-section">
              <button 
                className="integration-button secondary"
                onClick={handleTodoistSync}
                disabled={loading}
              >
                {loading ? 'Syncing...' : 'Sync with Todoist'}
              </button>
              
              {syncStatus === 'success' && (
                <div className="sync-message success">
                  ✅ Successfully synced {todoistTasks.length} tasks
                </div>
              )}
              
              {syncStatus === 'error' && (
                <div className="sync-message error">
                  ❌ Sync failed. Please check your API token.
                </div>
              )}
            </div>
            
            {todoistTasks.length > 0 && (
              <div className="synced-tasks">
                <h4>Synced Tasks ({todoistTasks.length})</h4>
                <div className="task-list">
                  {todoistTasks.slice(0, 5).map(task => (
                    <div key={task.id} className="synced-task">
                      <span className="task-status">
                        {task.is_completed ? '✅' : '⬜'}
                      </span>
                      <span className="task-content">{task.content}</span>
                    </div>
                  ))}
                  {todoistTasks.length > 5 && (
                    <div className="more-tasks">
                      And {todoistTasks.length - 5} more tasks...
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Coming Soon Integrations */}
        <div className="integration-card coming-soon">
          <div className="integration-header">
            <div className="integration-icon">🚀</div>
            <div className="integration-info">
              <h3>More Integrations Coming Soon</h3>
              <p>We're working on additional integrations</p>
            </div>
          </div>
          
          <div className="integration-content">
            <ul className="feature-list">
              <li>🔄 Trello integration</li>
              <li>🔄 Slack notifications</li>
              <li>🔄 Microsoft Outlook</li>
              <li>🔄 GitHub issues</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="integration-help">
        <h3>Need Help?</h3>
        <p>
          Having trouble with integrations? Check out our documentation or contact support.
          Make sure to set your API tokens in environment variables for external services.
        </p>
      </div>
    </div>
  );
};

export default Integrations;