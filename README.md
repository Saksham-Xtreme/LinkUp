# LinkUp

**LinkUp** is a real-time communication platform that allows users to connect through chat, media sharing, and video calls.  
The application provides instant messaging, online presence detection, and WebRTC-based video calling with screen sharing.

---

## 🚀 Features

### Authentication
- Google Sign-In using OAuth
- Username setup on first login
- Welcome email sent after registration

### Real-Time Messaging
- Instant chat between users
- Image sharing
- Message timestamps
- Typing indicators

### Presence System
- Online / Offline status
- Real-time notifications when users connect
- Live user list

### Video Calling
- One-to-one video calls
- Microphone mute/unmute
- Camera toggle
- Screen sharing
- End call functionality

---

## 🏗️ Architecture

LinkUp uses a hybrid architecture combining WebSockets for messaging and WebRTC for media communication.


Client (React)
│
WebSocket Signaling (Socket.IO)
│
Node.js + Express Server
│
MongoDB Database
│
WebRTC P2P Media Connection


Chat and signaling flow through the server, while audio/video streams are transmitted directly between peers.

---

## 🛠️ Tech Stack

### Frontend
- React
- WebRTC APIs
- Socket.IO Client

### Backend
- Node.js
- Express.js
- Socket.IO

### Database
- MongoDB

### Authentication
- Google OAuth 2.0

### Email Service
- Nodemailer

### Media Storage
- Cloudinary (or similar cloud storage)

---

## 📂 Project Structure


linkup
├── client
│ ├── components
│ ├── pages
│ ├── hooks
│ └── services
│
├── server
│ ├── routes
│ ├── controllers
│ ├── models
│ ├── sockets
│ └── utils
│
└── README.md


---

## 🔄 User Flow

1. User signs in with Google.
2. User selects a username.
3. Welcome email is sent.
4. User sees a list of available users.
5. User can start a chat or initiate a video call.
6. During calls users can enable screen sharing.

---

## ⚡ Installation

### Clone Repository

```bash
git clone https://github.com/your-username/linkup.git
cd linkup
Install Dependencies

Backend

cd server
npm install

Frontend

cd client
npm install
Run Application

Backend

npm run dev

Frontend

npm run dev
🔐 Environment Variables

Create a .env file in the server directory.

PORT=5000
MONGO_URI=your_mongodb_connection
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
CLOUDINARY_URL=your_cloudinary_url
📌 Future Improvements

Group video calls

Message reactions

File sharing

Push notifications

End-to-end encryption

SFU-based scaling for large meetings

📜 License

This project is open source and available under the MIT License.

👨‍💻 Author

Developed by Saksham Tripathi
Computer Science Engineering Student | Full Stack Developer


---

If you want, I can also give you **3 sections that make a README look “startup-level”**:

- **System Design Diagram**
- **WebRTC Signaling Flow**
- **Screenshots section**

These make your repo look **far more impressive to recruiters.**