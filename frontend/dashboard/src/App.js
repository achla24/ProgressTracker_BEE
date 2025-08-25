import React, { useEffect, useState } from "react";

function App() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/dashboard")  // call backend API
      .then(res => res.json())
      .then(data => setDashboard(data))
      .catch(err => console.error("Error fetching dashboard:", err));
  }, []);

  if (!dashboard) return <h2>Loading dashboard...</h2>;

  return (
    <div style={{ fontFamily: "Arial", padding: "20px" }}>
      <h1>📊 User Dashboard</h1>
      <p><strong>Today's Tasks:</strong> {dashboard.todayTasks}</p>
      <p><strong>Completed Tasks:</strong> {dashboard.completedTasks}</p>
      <p><strong>Focus Minutes:</strong> {dashboard.focusMinutes}</p>
      <p>
        <strong>Google Calendar:</strong>{" "}
        {dashboard.googleCalendarConnected ? "✅ Connected" : "❌ Not Connected"}
      </p>
    </div>
  );
}

export default App;