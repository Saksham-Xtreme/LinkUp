# Video Conferencing Architecture (WebRTC)
## Computer Networks Concepts and Stages

---

# 1. Transport Layer Foundation

Video conferencing is extremely **latency sensitive**. The transport protocol directly affects call quality.

---

## 1.1 TCP (Transmission Control Protocol)

### Characteristics
- Reliable, ordered delivery  
- Uses acknowledgements and retransmissions  
- Guarantees packet arrival  

### Problem for Video Calls
If a packet is lost, TCP stops transmission and retransmits.

This causes **video freezing and lag**.

### Example
If one packet of audio/video is lost:

- TCP pauses transmission  
- Resends the missing packet  
- Video appears to freeze temporarily  

### Conclusion
TCP reliability causes **high latency**, which is undesirable for real-time communication.

---

## 1.2 UDP (User Datagram Protocol)

### Characteristics
- No retransmission  
- No guaranteed delivery  
- Very low latency  

### Why WebRTC Uses UDP

If a packet is lost:

- It is simply ignored  
- Next frame is sent immediately  

### Result
Small visual flicker instead of call delay.

### Conclusion
UDP prioritizes **speed over reliability**, which is ideal for **live video communication**.

---

# 2. Four Stages of WebRTC Communication

WebRTC connections occur through **four logical stages**.

---

# Stage 1: Signaling (Connection Handshake)

WebRTC itself **does not define the signaling protocol**.

Developers usually implement it using:

- WebSockets  
- HTTP APIs  
- Socket.io  
- Firebase  

### Purpose
Exchange **Session Description Protocol (SDP)** messages.

---

## SDP (Session Description Protocol)

SDP describes the **capabilities of a device**.

### Information inside SDP
- Supported codecs (VP8, VP9, H.264)  
- Video resolution  
- Audio capabilities  
- Encryption parameters  
- Network information  

### Example negotiation logic

**Device A**

> I can send 1080p video using H.264

**Device B**

> I support H.264 but only up to 720p

They negotiate a **common compatible format**.

---

# Stage 2: Connectivity (Path Discovery)

Most devices are behind **NAT (Network Address Translation)** or firewalls.

This means:

- They don't have a public IP address  
- Direct communication becomes difficult  

WebRTC solves this using **ICE (Interactive Connectivity Establishment)**.

---

## ICE (Interactive Connectivity Establishment)

ICE finds the **best network path between two peers**.

### ICE Candidates

Possible connection endpoints consisting of: IP address + Port

Each peer collects multiple candidates and tries them.

---

## STUN Server

**STUN (Session Traversal Utilities for NAT)**

### Purpose
Discover your **public IP address**.

### Example

Your device asks STUN:

> What IP address do I appear as on the internet?

STUN replies with the **public IP and port mapping**.

---

## TURN Server

**TURN (Traversal Using Relays around NAT)**

Used when:

- Direct peer-to-peer connection fails  
- Corporate firewalls block traffic  

In this case:

- Media is **relayed through the TURN server**

This increases latency but ensures the call still works.

---

# Stage 3: Security (Encryption)

WebRTC **requires encryption**.  
Unencrypted WebRTC streams are not allowed.

Two protocols provide this security.

---

## DTLS (Datagram Transport Layer Security)

DTLS is the **UDP version of TLS**.

### Purpose
- Perform secure key exchange  
- Authenticate peers  
- Prevent man-in-the-middle attacks  

DTLS establishes a **shared encryption key between peers**.

---

## SRTP (Secure Real-time Transport Protocol)

Once DTLS creates keys, SRTP encrypts:

- Audio packets  
- Video packets  

### SRTP ensures
- Confidentiality  
- Packet integrity  
- Replay protection  

---

# Stage 4: Media and Data Transmission

Once the connection is established and secured, two main protocols handle communication.

---

## RTP (Real-time Transport Protocol)

RTP is used for **audio and video streaming**.

### Key features
- Sequence numbers  
- Timestamps  
- Packet ordering  
- Audio/video synchronization  

### Example

If packets arrive out of order: Packet 3 arrives before Packet 2


RTP sequence numbers allow the receiver to **reconstruct the correct order**.

---

## SCTP (Stream Control Transmission Protocol)

Used by **WebRTC DataChannels**.

### Characteristics
- Message oriented  
- Supports reliability control  
- Multiplexed streams  

It combines advantages of:

| Protocol | Feature |
|--------|--------|
| TCP | Reliability |
| UDP | Low latency |

---

# 3. Core WebRTC Components

WebRTC applications rely on **three major APIs**.

---

# 3.1 MediaStream — The Content Layer

MediaStream represents the **actual media content being transmitted**.

### Structure

A MediaStream contains tracks.

MediaStream
├── Video Track (Webcam)
└── Audio Track (Microphone)


---

### Key Responsibilities

#### Capture
Captures media from hardware:

- Camera  
- Microphone  
- Screen  

#### Synchronization
Ensures audio and video stay **perfectly aligned**.

Even a **200ms mismatch** creates poor user experience.

---

### Types of Streams

#### Local MediaStream
Media captured from the **user’s device**.

Example:

- Your webcam  
- Your microphone  

#### Remote MediaStream
Media received from the **other participant**.

Example:

- Other person’s camera feed  
- Other person’s audio  

---

# 3.2 RTCPeerConnection — The Networking Engine

RTCPeerConnection is the **core networking engine of WebRTC**.

It handles:

- Connection negotiation  
- Firewall traversal  
- Encryption  
- Bandwidth adaptation  

It functions as a **large networking state machine**.

---

### Responsibilities

#### Connection Management
Uses **ICE protocol** to find network paths.

#### Firewall Traversal
Performs **NAT traversal**.

#### Security
Automatically runs **DTLS handshake**.

#### Network Adaptation
Continuously monitors:

- Packet loss  
- Latency  
- Bandwidth  

If bandwidth drops: 1080p → 720p → 480p

This prevents call disconnections.

---

# 3.3 RTCDataChannel — Auxiliary Data

RTCDataChannel allows peers to send **non-media data**.

### Examples
- Text chat  
- File transfer  
- Game state  
- Cursor movement  
- Metadata  

---

### Underlying Protocol

RTCDataChannel uses **SCTP**.

---

### Reliability Modes

#### Reliable Mode
Similar to **TCP**.

Used for:

- Chat messages  
- File transfer  

Ensures **all packets arrive correctly**.

---

#### Unreliable Mode
Similar to **UDP**.

Used for:

- Gaming positions  
- Cursor coordinates  
- Real-time updates  

Lost packets are **not retransmitted**.

---

### Advantage

DataChannel runs inside the **same WebRTC connection**.

Therefore it has:

- Lower latency  
- No additional servers  
- Faster message delivery than WebSockets  

---

# 4. Complete WebRTC Workflow

The entire system works in a sequence of steps.

---

## Step 1: Capture Media

User device captures media:

Camera → Video Track
Microphone → Audio Track


These tracks form a **MediaStream**.

---

## Step 2: Attach Media

The MediaStream is attached to an **RTCPeerConnection**.

---

## Step 3: Signaling

Peers exchange:

- SDP Offer  
- SDP Answer  
- ICE Candidates  

This negotiation happens through a **signaling server**.

---

## Step 4: Establish Connection

ICE determines the best path:

1. Direct peer-to-peer  
2. STUN-assisted  
3. TURN relay  

---

## Step 5: Secure the Channel

- DTLS performs key exchange  
- SRTP encrypts media packets  

---

## Step 6: Media Transmission

| Type | Protocol |
|-----|-----|
| Video | RTP |
| Audio | RTP |
| Chat / Files | SCTP |

All packets travel through **encrypted UDP tunnels**.

---

# 5. Conceptual Analogy

| Component | Role | Analogy |
|---------|------|--------|
| MediaStream | Captures media | Actors |
| RTCPeerConnection | Manages network and security | Theater infrastructure |
| RTCDataChannel | Sends extra data | Messages passed during the show |

---

# 6. Key Networking Technologies Used

Video conferencing relies on multiple networking protocols:

- UDP  
- ICE  
- STUN  
- TURN  
- DTLS  
- SRTP  
- RTP  
- SCTP  
- SDP  

These protocols together enable **low latency, secure, peer-to-peer communication**.


