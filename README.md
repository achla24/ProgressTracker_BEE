# ProgressTracker — Modern Progress & Task Tracking System

A focused progress-tracking platform that helps teams and individuals monitor tasks, milestones, and real‑time progress with integrations for external services (Google, Todoist) and realtime updates via WebSockets.

🚀 Features
- 👤 Role-aware usage (Dashboard + API)
  - Dashboard (frontend)
    - Visualize tasks, timelines and progress
    - Real-time updates for task changes
  - Backend API
    - CRUD for tasks
    - Authentication-protected endpoints
    - Integration endpoints (Google, Todoist)
- 🔐 Authentication & Access
  - JWT-based auth middleware protecting task routes
- ✉️ Integrations & Sync
  - Google integration routes (in `/google`)
  - Todoist integration routes (in `/todoist`)
  - progresssync folder for utility/sync scripts
- 🔁 Real-time updates
  - Socket.IO used for realtime task/dashboard updates
- 📦 Persistence & Extensibility
  - MongoDB via Mongoose
  - RESTful API for programmatic access

🏗️ Technology Stack
- Frontend: React (Create React App), TypeScript, Tailwind CSS (see frontend/dashboard)
- Backend: Node.js, Express, Socket.IO, Mongoose (MongoDB)
- Auth & validation: jsonwebtoken, bcrypt, joi
- Other: axios, dotenv, morgan, cors

📡 Main API Routes (as mounted in backend/index.js)
- GET `/` — Health check: `{ message: "ProgressSync API is running 🚀" }`
- `/google` — Google integration routes
- `/auth` — authentication (register/login etc.)
- `/tasks` — protected task CRUD routes (requires auth middleware)
- `/dashboard` — dashboard-related endpoints
- `/todoist` — Todoist integration routes

⚙️ Getting Started

🔹 Prerequisites
- Node.js (v16+ recommended)
- npm
- MongoDB (local or hosted; connection via MONGODB_URI)

🔹 Install & Run

1. Clone the repository
```bash
git clone https://github.com/achla24/ProgressTracker_BEE.git
cd ProgressTracker_BEE
```

2. Backend
```bash
cd backend
npm install
```
Create a `.env` file inside `backend/` (example below) and then start:
```bash
# start (development)
npm run start
# (runs `nodemon index.js` as per backend/package.json)
```
By default the server uses `process.env.PORT` or `5000`.

3. Frontend (dashboard)
```bash
cd frontend/dashboard
npm install
npm start
# runs `react-app-rewired start` (CRA + custom overrides)
```
The frontend dev server usually runs at http://localhost:3000.

4. Running both
- Start backend and frontend in separate terminals.
- Frontend communicates with backend (set REACT_APP_API_URL if necessary).

## Example .env (backend/.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/progresstracker
JWT_SECRET=your_jwt_secret_here
# Optional integrations
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
TODOIST_TOKEN=your_todoist_token
```

## Frontend environment (optional)
Create `frontend/dashboard/.env`:
```
REACT_APP_API_URL=http://localhost:5000
```

📂 Project Structure (relevant files/folders)
```
ProgressTracker_BEE/
├── backend/
│   ├── index.js                 # Express + Socket.IO entry
│   ├── package.json
│   └── src/                     # routes, middlewares, models, socket, ...
├── frontend/
│   └── dashboard/
│       ├── package.json         # React app (CRA + react-app-rewired)
│       └── src/                 # React source (TS + Tailwind)
├── progresssync/                # sync utilities / integration helpers
├── .gitignore
└── README.md
```

🔌 Notes about Socket / Realtime
- Socket server is configured in `backend/index.js` and its logic lives in `backend/src/socket`.
- The frontend uses `socket.io-client` (listed in `frontend/dashboard/package.json`) to receive/send realtime events. For production, restrict CORS origins in backend Socket.IO config.

🧪 Testing
- Backend: no automated tests configured by default (backend/package.json `test` echoes placeholder).
- Frontend: use CRA test runner from `frontend/dashboard`:
```bash
npm test
```

🛡️ Production considerations
- Lock CORS origins instead of `origin: "*"` in Socket.IO and Express CORS.
- Use secure storage for secrets (e.g., environment variables or a secrets manager).
- Configure proper logging, rate limiting and input validation for public deployments.

🙌 Acknowledgements
Built using open-source tooling: Create React App, Express, Mongoose, Socket.IO, Tailwind, and other community packages.

🧑‍💻 Contributing
Contributions welcome:
1. Fork the repo
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit & push
4. Open a Pull Request describing your change

If you plan major changes, open an issue first to discuss.

👩‍💻 Maintainer
Repository owner: achla24  
GitHub: https://github.com/achla24

---

If you'd like, I can:
- Replace placeholders with exact env var names and a full endpoint list by scanning `backend/src` route files, or
- Commit this README.md directly to the repository for you. Which would you prefer?
