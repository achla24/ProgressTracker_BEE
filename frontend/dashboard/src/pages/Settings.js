import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Settings.css';

function Settings() {
  const { user, updateProfile, logout } = useAuth();
  const [settings, setSettings] = useState({
    // Profile settings
    displayName: '',
    email: '',
    avatar: '',
    
    // Notification settings
    emailNotifications: true,
    pushNotifications: true,
    taskReminders: true,
    dailyDigest: false,
    
    // Timer settings
    pomodoroLength: 25,
    shortBreakLength: 5,
    longBreakLength: 15,
    autoStartBreaks: false,
    autoStartPomodoros: false,
    
    // Theme settings
    theme: 'light',
    language: 'en',
    dateFormat: 'MM/dd/yyyy',
    timeFormat: '12h',
    
    // Integration settings
    googleCalendarSync: false,
    todoistSync: false,
    
    // Privacy settings
    dataSharing: false,
    analytics: true
  });

  const [integrationStatus, setIntegrationStatus] = useState({
    googleCalendar: 'disconnected',
    todoist: 'disconnected'
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadUserSettings();
    checkIntegrationStatus();
  }, []);

  const loadUserSettings = () => {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }));
    }
    
    // Set user data if available
    if (user) {
      setSettings(prev => ({
        ...prev,
        displayName: user.name || '',
        email: user.email || ''
      }));
    }
  };

  const checkIntegrationStatus = async () => {
    try {
      // Check Google Calendar status
      const googleStatus = localStorage.getItem('googleCalendarConnected') === 'true' 
        ? 'connected' : 'disconnected';
      
      // Check Todoist status
      const todoistStatus = localStorage.getItem('todoistConnected') === 'true' 
        ? 'connected' : 'disconnected';
      
      setIntegrationStatus({
        googleCalendar: googleStatus,
        todoist: todoistStatus
      });
    } catch (error) {
      console.error('Failed to check integration status:', error);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      // Save to localStorage
      localStorage.setItem('userSettings', JSON.stringify(settings));
      
      // Update profile if changed
      if (settings.displayName !== user?.name && updateProfile) {
        await updateProfile({ name: settings.displayName });
      }
      
      // Apply theme immediately
      document.documentElement.setAttribute('data-theme', settings.theme);
      
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefaults = () => {
    if (window.confirm('Reset all settings to default values?')) {
      setSettings({
        displayName: user?.name || '',
        email: user?.email || '',
        avatar: '',
        emailNotifications: true,
        pushNotifications: true,
        taskReminders: true,
        dailyDigest: false,
        pomodoroLength: 25,
        shortBreakLength: 5,
        longBreakLength: 15,
        autoStartBreaks: false,
        autoStartPomodoros: false,
        theme: 'light',
        language: 'en',
        dateFormat: 'MM/dd/yyyy',
        timeFormat: '12h',
        googleCalendarSync: false,
        todoistSync: false,
        dataSharing: false,
        analytics: true
      });
    }
  };

  const handleIntegrationConnect = async (service) => {
    try {
      if (service === 'googleCalendar') {
        // Redirect to Google OAuth
        window.location.href = '/api/google/auth';
      } else if (service === 'todoist') {
        // Redirect to Todoist OAuth
        window.location.href = '/api/todoist/auth';
      }
    } catch (error) {
      console.error(`Failed to connect to ${service}:`, error);
      alert(`Failed to connect to ${service}. Please try again.`);
    }
  };

  const handleIntegrationDisconnect = async (service) => {
    if (window.confirm(`Disconnect from ${service}? This will stop syncing data.`)) {
      try {
        if (service === 'googleCalendar') {
          localStorage.removeItem('googleCalendarConnected');
          setIntegrationStatus(prev => ({ ...prev, googleCalendar: 'disconnected' }));
        } else if (service === 'todoist') {
          localStorage.removeItem('todoistConnected');
          setIntegrationStatus(prev => ({ ...prev, todoist: 'disconnected' }));
        }
        alert(`Disconnected from ${service} successfully.`);
      } catch (error) {
        console.error(`Failed to disconnect from ${service}:`, error);
        alert(`Failed to disconnect from ${service}. Please try again.`);
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        // Call delete account API
        // await api.delete('/auth/account');
        
        // Clear all local data
        localStorage.clear();
        
        // Logout user
        logout();
        
        alert('Account deleted successfully.');
      } catch (error) {
        console.error('Failed to delete account:', error);
        alert('Failed to delete account. Please try again.');
      }
    }
  };

  const exportData = () => {
    try {
      const userData = {
        settings: settings,
        tasks: JSON.parse(localStorage.getItem('tasks') || '[]'),
        focusSessions: JSON.parse(localStorage.getItem('focusSessions') || '[]'),
        exportDate: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `progress-tracker-data-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
    } catch (error) {
      console.error('Failed to export data:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'timer', label: 'Focus Timer', icon: '⏰' },
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
    { id: 'integrations', label: 'Integrations', icon: '🔗' },
    { id: 'privacy', label: 'Privacy & Data', icon: '🔐' }
  ];

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Settings</h1>
        <div className="settings-actions">
          <button onClick={resetToDefaults} className="reset-btn">
            Reset to Defaults
          </button>
          <button 
            onClick={saveSettings} 
            disabled={isSaving}
            className="save-btn"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="settings-content">
        <div className="settings-sidebar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            >
              <span className="tab-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="settings-panel">
          {activeTab === 'profile' && (
            <div className="panel-content">
              <h3>Profile Information</h3>
              <div className="form-group">
                <label>Display Name</label>
                <input
                  type="text"
                  value={settings.displayName}
                  onChange={(e) => handleSettingChange('displayName', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={settings.email}
                  disabled
                  className="disabled-input"
                />
                <small>Email cannot be changed</small>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="panel-content">
              <h3>Notification Preferences</h3>
              <div className="toggle-group">
                <div className="toggle-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                    />
                    Email Notifications
                  </label>
                  <small>Receive task updates via email</small>
                </div>
                <div className="toggle-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.pushNotifications}
                      onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                    />
                    Browser Notifications
                  </label>
                  <small>Show desktop notifications for task reminders</small>
                </div>
                <div className="toggle-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.taskReminders}
                      onChange={(e) => handleSettingChange('taskReminders', e.target.checked)}
                    />
                    Task Reminders
                  </label>
                  <small>Get reminders for upcoming task deadlines</small>
                </div>
                <div className="toggle-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.dailyDigest}
                      onChange={(e) => handleSettingChange('dailyDigest', e.target.checked)}
                    />
                    Daily Digest
                  </label>
                  <small>Receive daily summary of your progress</small>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timer' && (
            <div className="panel-content">
              <h3>Focus Timer Settings</h3>
              <div className="form-group">
                <label>Pomodoro Length (minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.pomodoroLength}
                  onChange={(e) => handleSettingChange('pomodoroLength', parseInt(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label>Short Break Length (minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={settings.shortBreakLength}
                  onChange={(e) => handleSettingChange('shortBreakLength', parseInt(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label>Long Break Length (minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.longBreakLength}
                  onChange={(e) => handleSettingChange('longBreakLength', parseInt(e.target.value))}
                />
              </div>
              <div className="toggle-group">
                <div className="toggle-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.autoStartBreaks}
                      onChange={(e) => handleSettingChange('autoStartBreaks', e.target.checked)}
                    />
                    Auto-start Breaks
                  </label>
                  <small>Automatically start break timers</small>
                </div>
                <div className="toggle-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.autoStartPomodoros}
                      onChange={(e) => handleSettingChange('autoStartPomodoros', e.target.checked)}
                    />
                    Auto-start Pomodoros
                  </label>
                  <small>Automatically start next pomodoro after break</small>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="panel-content">
              <h3>Appearance & Localization</h3>
              <div className="form-group">
                <label>Theme</label>
                <select
                  value={settings.theme}
                  onChange={(e) => handleSettingChange('theme', e.target.value)}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto (System)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date Format</label>
                <select
                  value={settings.dateFormat}
                  onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                >
                  <option value="MM/dd/yyyy">MM/DD/YYYY</option>
                  <option value="dd/MM/yyyy">DD/MM/YYYY</option>
                  <option value="yyyy-MM-dd">YYYY-MM-DD</option>
                </select>
              </div>
              <div className="form-group">
                <label>Time Format</label>
                <select
                  value={settings.timeFormat}
                  onChange={(e) => handleSettingChange('timeFormat', e.target.value)}
                >
                  <option value="12h">12 Hour</option>
                  <option value="24h">24 Hour</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="panel-content">
              <h3>External Integrations</h3>
              <div className="integration-item">
                <div className="integration-info">
                  <h4>Google Calendar</h4>
                  <p>Sync your tasks with Google Calendar events</p>
                  <span className={`status ${integrationStatus.googleCalendar}`}>
                    {integrationStatus.googleCalendar === 'connected' ? '✅ Connected' : '❌ Disconnected'}
                  </span>
                </div>
                <div className="integration-actions">
                  {integrationStatus.googleCalendar === 'connected' ? (
                    <button 
                      onClick={() => handleIntegrationDisconnect('googleCalendar')}
                      className="disconnect-btn"
                    >
                      Disconnect
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleIntegrationConnect('googleCalendar')}
                      className="connect-btn"
                    >
                      Connect
                    </button>
                  )}
                </div>
              </div>
              
              <div className="integration-item">
                <div className="integration-info">
                  <h4>Todoist</h4>
                  <p>Import and sync tasks with your Todoist account</p>
                  <span className={`status ${integrationStatus.todoist}`}>
                    {integrationStatus.todoist === 'connected' ? '✅ Connected' : '❌ Disconnected'}
                  </span>
                </div>
                <div className="integration-actions">
                  {integrationStatus.todoist === 'connected' ? (
                    <button 
                      onClick={() => handleIntegrationDisconnect('todoist')}
                      className="disconnect-btn"
                    >
                      Disconnect
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleIntegrationConnect('todoist')}
                      className="connect-btn"
                    >
                      Connect
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="panel-content">
              <h3>Privacy & Data Management</h3>
              <div className="toggle-group">
                <div className="toggle-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.dataSharing}
                      onChange={(e) => handleSettingChange('dataSharing', e.target.checked)}
                    />
                    Data Sharing
                  </label>
                  <small>Share anonymous usage data to help improve the app</small>
                </div>
                <div className="toggle-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.analytics}
                      onChange={(e) => handleSettingChange('analytics', e.target.checked)}
                    />
                    Analytics
                  </label>
                  <small>Allow collection of analytics data for app improvement</small>
                </div>
              </div>
              
              <div className="data-management">
                <h4>Data Management</h4>
                <div className="data-actions">
                  <button onClick={exportData} className="export-btn">
                    Export My Data
                  </button>
                  <button 
                    onClick={handleDeleteAccount} 
                    className="delete-account-btn"
                  >
                    Delete Account
                  </button>
                </div>
                <small>Export includes all your tasks, settings, and focus session data</small>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;