# 🕹️ Controllers Module

Controllers contain the core logical processing for the backend application, handling Socket.io real-time connection events and incoming Express HTTP requests.

## 📄 Files
* **[socketManger.js](file:///Users/sakshamtripathi/Desktop/Video-Confrencing/Backend/src/controllers/socketManger.js):** Coordinates Socket.io socket connections, manages user room assignments, coordinates the WebRTC signaling flow (SDP Offer/Answer exchange, ICE Candidate relaying), synchronizes active chat messaging, and handles connection teardowns safely.
* **[users.controller.js](file:///Users/sakshamtripathi/Desktop/Video-Confrencing/Backend/src/controllers/users.controller.js):** Contains business logic for credential validation, user sign-up/registration, user sign-in/login (JWT creation), and retrieving user meeting history records.
