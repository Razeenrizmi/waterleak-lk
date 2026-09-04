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
| **Member 2** | 🗺️ Map & Tracking | `LeakMap.jsx`, `LeakCard.jsx`, `LeakFilters.jsx`, `LeakPopup.jsx`, `LeakDetails.jsx`, `mapService.js` | `mapRoutes.js` (`GET /api/map/leaks`) |
| **Member 3** | 🤖 AI Leak Analysis | `AiLeakAnalyzer.jsx` | `aiRoutes.js` & `aiController.js` (`POST /api/ai/analyze`) |
| **Member 4** | 📊 Admin Dashboard | `AdminDashboard.jsx` | `adminRoutes.js` (`GET /api/admin/triage`) |

---

## 🗺️ Member 2: Leak Management & Map Module

### Technology
- **React Leaflet** + **OpenStreetMap** for interactive mapping
- **Axios** for API communication
- **Lucide React** for icons

### Main Functionality
- Interactive Sri Lanka leak map centered at `[7.8731, 80.7718]` with zoom level 7
- Leak markers displayed on map using coordinates from backend
- Search by location, leak type, or description (case-insensitive)
- Filter by status: All, PENDING, VERIFIED, DISPATCHED, RESOLVED, REJECTED
- Filter by leak type: Main Pipeline Burst, Roadway Surface Leak, Household Meter Leak, Commercial Overflow, Subsurface Main Seepage, Unknown Leak Type
- Leak cards with status badges and details
- Map marker popups with leak information
- Detailed leak view with all report information including AI analysis fields
- Loading, error, and empty states
- Responsive design (desktop: side-by-side layout, mobile: stacked layout)
- Sample data fallback for development when backend is unavailable

### API Integration
- **Endpoint:** `GET /api/map/leaks`
- **Service:** `frontend/src/modules/map/mapService.js`
- **Environment Variable:** `VITE_API_URL` (defaults to `http://localhost:5000`)

### Expected Leak Report Fields
The frontend expects leak reports to contain:
- `_id` or `id` - Unique identifier
- `location` - Text location (e.g., "Kandy")
- `latitude` or `lat` - Coordinate for map marker
- `longitude` or `lng` - Coordinate for map marker
- `leakType` - Type of leak (enum from backend)
- `description` - Leak description
- `status` - Current status (PENDING, VERIFIED, DISPATCHED, RESOLVED, REJECTED)
- `createdAt` or `timestamp` - Report date
- `imageUrl` - Optional image URL
- AI analysis fields (optional): `severityLevel`, `severityScore`, `estimatedLossPerHourLiters`, `priorityScore`, `recommendedAction`, `targetAuthority`, `safetyAdvisory`

### Components Created
- `LeakMap.jsx` - Main map component with filters, cards, and map
- `LeakCard.jsx` - Individual leak card component
- `LeakFilters.jsx` - Search and filter controls
- `LeakPopup.jsx` - Map marker popup
- `LeakDetails.jsx` - Detailed leak view
- `mapService.js` - API service for fetching leaks

### How to Run & Test
1. Start the frontend: `cd frontend && npm run dev`
2. Navigate to the "Member 2 (Map)" tab in the application
3. The map will load with sample data if the backend is not available
4. Test search, filters, and leak details
5. Click markers on the map to view popups
6. Click "View Details" on cards or popups to see full leak information
