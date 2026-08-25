# 🚀 LinkUp Backend

The backend of **LinkUp** is a robust Node.js and Express server powered by Socket.io for low-latency real-time signaling, chat messaging, and user synchronization.

## 🛠️ Features
* **Authentication & Authorization:** Secure user registration, login, and JWT-based session verification.
* **Google OAuth 2.0 Integration:** Third-party SSO via Passport.js configuration.
* **WebRTC Signaling Server:** Brokers connection handshakes (SDP Offers, Answers, and ICE Candidates) between peers using Socket.io.
* **Real-time Chat Rooms:** Multi-user chat synchronization, room creation, and persistent message history during calls.
* **Database Management:** MongoDB schema design for persistent user details and meeting history metadata.

## 📂 Directory Structure

```text
Backend/
├── src/
│   ├── app.js                 # Express application & HTTP server initialization
│   ├── config/
│   │   └── passport.js        # Passport.js strategy configuration for Google OAuth
│   ├── controllers/
│   │   ├── socketManger.js    # Signaling server, chat room handlers & WebRTC messaging
│   │   └── users.controller.js# User registration, login, profile, and history routes
│   ├── init/
│   │   └── data.js            # Initial seed data for test environments
│   ├── models/
│   │   ├── meeting.model.js   # MongoDB Mongoose schema for meetings
│   │   └── users.model.js     # MongoDB Mongoose schema for user accounts
│   └── routes/
│       ├── auth.routes.js     # Google OAuth endpoints
│       └── users.routes.js    # Registration, login, profile, and user interaction endpoints
├── package.json               # Backend script definitions and dependencies
└── .env                       # Local environment configurations (not tracked by Git)
```

## ⚡ Setup & Installation

### 1. Configure Environment Variables
Create a `.env` file in the root of the `Backend/` directory with the following variables:
```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Server
* **Development Mode (with hot-reload):**
  ```bash
  npm run dev
  ```
* **Production Mode:**
  ```bash
  npm start
  ```
