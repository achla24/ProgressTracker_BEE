import React, { useState, useEffect } from 'react';
import './FocusTimer.css';

const FocusTimer = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [focusSessions, setFocusSessions] = useState([]);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          handleTimerComplete();
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, isBreak]);

  const handleTimerComplete = () => {
    setIsActive(false);
    
    if (!isBreak) {
      // Completed a focus session
      const newPomodoroCount = pomodoroCount + 1;
      setPomodoroCount(newPomodoroCount);
      
      // Add to focus sessions history
      const newSession = {
        id: Date.now(),
        duration: 25,
        completedAt: new Date(),
        type: 'focus'
      };
      setFocusSessions([...focusSessions, newSession]);
      
      // Determine break length
      const breakDuration = newPomodoroCount % 4 === 0 ? 15 : 5;
      setMinutes(breakDuration);
      setIsBreak(true);
      
      // Show notification
      if (Notification.permission === 'granted') {
        new Notification('Focus Session Complete!', {
          body: `Great job! Time for a ${breakDuration}-minute break.`,
          icon: '⏰'
        });
      }
    } else {
      // Completed a break
      setMinutes(25);
      setIsBreak(false);
      
      if (Notification.permission === 'granted') {
        new Notification('Break Complete!', {
          body: 'Ready for another focused work session?',
          icon: '🎯'
        });
      }
    }
    setSeconds(0);
  };

  const toggle = () => {
    if (!isActive && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
    setIsActive(!isActive);
  };

  const reset = () => {
    setIsActive(false);
    setMinutes(25);
    setSeconds(0);
    setIsBreak(false);
  };

  const formatTime = (mins, secs) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTodaysSessions = () => {
    const today = new Date().toDateString();
    return focusSessions.filter(session => 
      new Date(session.completedAt).toDateString() === today
    );
  };

  const todaysSessions = getTodaysSessions();
  const todaysFocusTime = todaysSessions.reduce((total, session) => total + session.duration, 0);

  return (
    <div className="focus-timer-container">
      <div className="timer-header">
        <h1>⏰ Focus Timer</h1>
        <p>Stay focused with the Pomodoro Technique</p>
      </div>

      <div className="timer-grid">
        <div className="timer-main">
          <div className={`timer-circle ${isBreak ? 'break-mode' : 'focus-mode'}`}>
            <div className="timer-display">
              <div className="timer-time">{formatTime(minutes, seconds)}</div>
              <div className="timer-label">
                {isBreak ? '☕ Break Time!' : '🎯 Focus Time!'}
              </div>
            </div>
          </div>

          <div className="timer-controls">
            <button
              onClick={toggle}
              className={`control-btn ${isActive ? 'pause' : 'start'}`}
            >
              {isActive ? '⏸️ Pause' : '▶️ Start'}
            </button>
            <button onClick={reset} className="control-btn reset">
              🔄 Reset
            </button>
          </div>

          <div className="session-info">
            <div className="pomodoro-count">
              <span className="count-number">{pomodoroCount}</span>
              <span className="count-label">Pomodoros Completed</span>
            </div>
          </div>
        </div>

        <div className="timer-stats">
          <div className="stats-card">
            <h3>📊 Today's Progress</h3>
            <div className="stat-item">
              <span className="stat-value">{todaysSessions.length}</span>
              <span className="stat-label">Sessions</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{todaysFocusTime}</span>
              <span className="stat-label">Minutes</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${Math.min((todaysFocusTime / 120) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="progress-text">
              Goal: 120 minutes ({Math.round((todaysFocusTime / 120) * 100)}%)
            </div>
          </div>

          <div className="stats-card">
            <h3>⚙️ Timer Settings</h3>
            <div className="setting-item">
              <label>Focus Duration:</label>
              <select 
                value={!isActive ? 25 : minutes} 
                onChange={(e) => !isActive && setMinutes(Number(e.target.value))}
                disabled={isActive}
              >
                <option value={15}>15 minutes</option>
                <option value={25}>25 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
              </select>
            </div>
            <div className="setting-item">
              <label>Auto-start breaks:</label>
              <input type="checkbox" defaultChecked />
            </div>
            <div className="setting-item">
              <label>Sound notifications:</label>
              <input type="checkbox" defaultChecked />
            </div>
          </div>
        </div>
      </div>

      {todaysSessions.length > 0 && (
        <div className="sessions-history">
          <h3>📝 Today's Sessions</h3>
          <div className="sessions-list">
            {todaysSessions.map(session => (
              <div key={session.id} className="session-item">
                <span className="session-icon">🎯</span>
                <span className="session-duration">{session.duration} min</span>
                <span className="session-time">
                  {new Date(session.completedAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FocusTimer;