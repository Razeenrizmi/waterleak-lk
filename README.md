# 💧 WaterLeak LK — Community Water Waste Management System (MERN Stack)

> **Sri Lanka 4-Hour Hackathon Project**  
> An AI-powered water waste monitoring and municipal triage platform built with the MERN Stack (MongoDB, Express.js, React, Node.js) for Sri Lanka (NWSDB & Local Municipalities).

---

## 📁 Complete MERN Directory Architecture (Conflict-Free)

The project combines both **Frontend** and **Backend** in the same repository, with 4 isolated module subdirectories to guarantee **0 merge conflicts**:

```text
waterleak-lk/
├── package.json               <-- Root Monorepo runner (concurrently)
├── README.md
│
├── backend/                   <-- Node.js + Express + MongoDB Backend
│   ├── package.json
│   ├── server.js              <-- Main Express Server (Port 5000)
│   ├── .env.example
│   └── src/
│       ├── config/
│       │   └── db.js          <-- MongoDB Mongoose Connection
│       ├── models/
│       │   └── Leak.js        <-- Shared Leak Mongoose Schema
│       ├── services/
│       │   └── leakAnalysisService.js  (Member 3 Gemini AI Service)
│       ├── controllers/
│       │   ├── reportingController.js  (Member 1)
│       │   ├── mapController.js        (Member 2)
│       │   ├── aiController.js         (Member 3)
│       │   └── adminController.js      (Member 4)
│       └── routes/
│           ├── reportingRoutes.js (Member 1: POST /api/reports)
│           ├── mapRoutes.js       (Member 2: GET /api/map/leaks)
│           ├── aiRoutes.js        (Member 3: POST /api/ai/analyze)
│           └── adminRoutes.js     (Member 4: GET /api/admin/triage)
│
└── frontend/                  <-- React + Vite + Tailwind CSS Frontend
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── modules/
        │   ├── reporting/     <-- Member 1 (Reporting Form Component)
        │   ├── map/           <-- Member 2 (Interactive Map Component)
        │   ├── ai-analysis/   <-- Member 3 (AiLeakAnalyzer.jsx, service, prompts)
        │   └── admin/         <-- Member 4 (Admin Dashboard Component)
        ├── shared/
        │   ├── mockData.json
        │   └── apiConfig.js
        ├── App.jsx            <-- Leader Integration Container
        └── main.jsx
```

---

## ⚡ Quick Start & Running Frontend + Backend

### 1. Install Dependencies
```bash
# Install root monorepo runner
npm install

# Install backend & frontend packages
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### 2. Run Both Frontend & Backend Concurrently
From the root directory:
```bash
npm run dev
```
- **Backend API:** `http://localhost:5000`
- **Frontend App:** `http://localhost:5173`

---

## 👥 4-Member MERN Module Division

| Member | Module | Frontend (`frontend/src/modules/`) | Backend (`backend/src/`) |
| :--- | :--- | :--- | :--- |
| **Member 1** | 📝 Reporting | `ReportingForm.jsx` | `reportingRoutes.js` (`POST /api/reports`) |
| **Member 2** | 🗺️ Map & Tracking | `LeakMap.jsx` | `mapRoutes.js` (`GET /api/map/leaks`) |
| **Member 3** | 🤖 AI Leak Analysis | `AiLeakAnalyzer.jsx` | `aiRoutes.js` & `aiController.js` (`POST /api/ai/analyze`) |
| **Member 4** | 📊 Admin Dashboard | `AdminDashboard.jsx` | `adminRoutes.js` (`GET /api/admin/triage`) |
