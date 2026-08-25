# 📚 Video Conferencing & WebRTC Notes

This folder contains a collection of comprehensive, deep-dive notes and guides exploring both the theoretical foundations and implementation details of real-time video conferencing applications.

## 🗂️ Contents

### 1. [Video Conferencing Architectures (`architecture.md`)](file:///Users/sakshamtripathi/Desktop/Video-Confrencing/Notes/architecture.md)
* **Description:** A detailed overview of modern video conferencing architectures.
* **Topics Covered:**
  * **Peer-to-Peer (P2P):** Full-mesh architecture where media streams are sent directly between participants (used in LinkUp).
  * **SFU (Selective Forwarding Unit):** Media server that receives media streams from each participant and forwards them to others.
  * **MCU (Multipoint Control Unit):** Media server that mixes streams and sends a single blended stream to each participant.
  * **Comparison:** Detailed analysis of scalability, latency, bandwidth, and complexity tradeoffs.

### 2. [WebRTC & Computer Networks Concepts (`notes.md`)](file:///Users/sakshamtripathi/Desktop/Video-Confrencing/Notes/notes.md)
* **Description:** Network-layer foundations for video conferencing.
* **Topics Covered:**
  * **Transport Layer Protocols:** Why UDP is preferred over TCP for low-latency video streaming.
  * **Network Congestion & Latency:** Handling packet loss, jitter, and bandwidth adaptation.
  * **Interactive Connectivity Establishment (ICE):** Understanding how STUN and TURN resolve NAT traversal.

### 3. [Real-Time WebSockets with Socket.IO (`socket.id.md`)](file:///Users/sakshamtripathi/Desktop/Video-Confrencing/Notes/socket.id.md)
* **Description:** Explanation of real-time bidirectional communication.
* **Topics Covered:**
  * **HTTP vs WebSockets:** Full-duplex connection comparison.
  * **Socket.io Mechanisms:** Socket IDs, rooms, events, broadcasting, and connection lifecycles.
  * **Use Case:** How WebSockets act as the signaling server to coordinate WebRTC connections.

### 4. [STUN Servers Demystified (`stun-server.md`)](file:///Users/sakshamtripathi/Desktop/Video-Confrencing/Notes/stun-server.md)
* **Description:** Simple breakdown of Session Traversal Utilities for NAT (STUN) servers.
* **Topics Covered:**
  * **NAT (Network Address Translation):** Why local private IPs cannot directly connect on the public internet.
  * **The Mirror Concept:** How STUN servers return your public-facing IP and port.
  * **Why They Are Free:** Low bandwidth requirements compared to TURN servers (which relay media).

### 5. [WebRTC React Implementation (`videoComponent.md`)](file:///Users/sakshamtripathi/Desktop/Video-Confrencing/Notes/videoComponent.md)
* **Description:** A step-by-step breakdown of how the client-side WebRTC logic is implemented.
* **Topics Covered:**
  * **Signaling & Connectivity:** STUN server configuration, socket events (`join-call`, `user-joined`), and the SDP negotiation loop.
  * **Media Stream & Device Control:** Handling user camera/mic access (`getUserMedia`) and track toggles.
  * **State Management:** Keeping track of peer connections, active streams, and UI rendering states.
