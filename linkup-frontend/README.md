# 🔗 LinkUp Frontend

The user interface of **LinkUp** is built using React, powered by Vite for development and compilation, and designed with Material-UI (MUI) components. It provides a real-time, low-latency video conferencing and instant messaging user interface.

## 🛠️ Features
* **Signaling & P2P Stream Connection:** Interacts with the backend signaling server using `socket.io-client` to negotiate WebRTC direct connections.
* **Responsive Video Interface:** Offers fluid video grids supporting multi-peer screens, audio/video toggle actions, and screen-sharing functions.
* **Onboarding & Authentication Flow:** Fully featured landing, register, login, and dashboard (Home) pages, incorporating Google OAuth SSO integration.
* **Real-time Live Chat Overlay:** Side panel chat integration synced across peers in the active meeting room.

## 📂 Directory Structure

```text
linkup-frontend/
├── public/                    # Static public assets
├── src/
│   ├── assets/                # Local graphic assets (SVG, icons)
│   ├── components/            # Reusable UI component definitions
│   │   ├── Footer.jsx         # System footer design
│   │   └── ProtectedRoute.jsx # Route guard matching authentication state
│   ├── contexts/              # React Context declarations
│   │   └── AuthContext.jsx    # Global Authentication context (user state, sign-in/out logic)
│   ├── pages/                 # Full Page routing views
│   │   ├── authentication.jsx # Credentials-based registration and login views
│   │   ├── home.jsx           # Lobby/Dashboard for starting/joining rooms and viewing history
│   │   ├── landing.jsx        # Landing page introducing LinkUp features
│   │   └── VideoMeet.jsx      # Heavy WebRTC-based call screen containing controls and grids
│   ├── styles/                # CSS Stylesheets and modules
│   │   ├── home.css           # Styling for home dashboard components
│   │   └── videoComponent.module.css # Component-level style declarations for call grids
│   ├── App.css                # Global system styles
│   ├── App.jsx                # Router config and core structure mapping
│   ├── index.css              # Main index stylesheet
│   └── main.jsx               # Entry point linking React and DOM
├── package.json               # Package configurations, commands, and dependencies
└── vite.config.js             # Vite compiler specific settings
```

## ⚡ Setup & Installation

### 1. Configure Environment Variables
Create a `.env` file in the root of the `linkup-frontend/` directory with the following variables:
```env
VITE_BACKEND_URL=http://localhost:8000
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Frontend
* **Development Server:**
  ```bash
  npm run dev
  ```
* **Production Build:**
  ```bash
  npm run build
  ```
* **Build Preview:**
  ```bash
  npm run preview
  ```
