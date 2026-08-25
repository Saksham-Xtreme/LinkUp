# Video Conferencing Architectures

Modern video conferencing systems typically follow three main architectural models:

1. Peer-to-Peer (P2P)
2. SFU (Selective Forwarding Unit)
3. MCU (Multipoint Control Unit)

Each architecture differs in **scalability, bandwidth usage, latency, and infrastructure complexity**.

---

# 1. Peer-to-Peer (P2P)

## Overview

In a **Peer-to-Peer architecture**, participants send media streams **directly to each other** without a central media server.

WebRTC was originally designed for this model.

Each participant establishes a **direct connection with every other participant**.

---

## Architecture Diagram
User A ────── User B
│ │
│ │
└────── User C


Every participant sends media streams to every other participant.

---

## How It Works

1. Signaling server exchanges SDP and ICE candidates.
2. Each peer creates a **direct WebRTC connection**.
3. Media streams are transmitted directly using **RTP over UDP**.
4. Encryption is handled using **DTLS-SRTP**.

---

## Bandwidth Requirement

Bandwidth grows **quadratically**.

Example with **4 users**

Each user sends **3 streams**.
Upload per user = (N - 1) streams


Where **N = number of participants**.

---

## Advantages

- Very low latency
- No expensive media servers required
- Fully decentralized
- Simple architecture

---

## Disadvantages

- Poor scalability
- High upload bandwidth usage
- Heavy CPU usage for encoding multiple streams
- Not suitable for large meetings

---

## Best Use Cases

- 1:1 video calls
- Small group meetings (2–4 participants)
- Peer-to-peer applications

Examples:

- Early WebRTC implementations
- Simple video chat applications

---

# 2. SFU (Selective Forwarding Unit)

## Overview

In **SFU architecture**, a central server receives media streams and **forwards them to other participants** without decoding them.

The server **does not process the video**, it only routes packets.

Each participant sends **one stream to the server**, and the server forwards it to others.

---

## Architecture Diagram
    SFU Server
    /   |   \
   /    |    \
User A User B User C


All participants connect to the **SFU server**.

---

## How It Works

1. Each user sends **one encoded stream** to the SFU.
2. SFU receives RTP packets.
3. SFU selectively forwards streams to other participants.
4. Participants receive multiple streams.

The SFU may also support **Simulcast or SVC** to adjust video quality.

---

## Bandwidth Requirement

Upload per user remains **constant**.
Upload = 1 stream
Download = (N - 1) streams


---

## Advantages

- Highly scalable
- Lower client upload bandwidth
- Low latency
- Efficient for large meetings

---

## Disadvantages

- Requires media server infrastructure
- Higher server bandwidth cost
- Server must manage many RTP streams

---

## Best Use Cases

- Group video calls
- Online classes
- Webinars
- Video collaboration tools

---

## Real World Examples

Platforms using SFU architecture:

- Zoom
- Google Meet
- Jitsi Meet
- Microsoft Teams

---

# 3. MCU (Multipoint Control Unit)

## Overview

MCU architecture uses a **central media server that processes video streams**.

The server:

1. Receives all participant streams
2. Decodes them
3. Mixes them into a single video stream
4. Sends the combined stream back to participants

---

## Architecture Diagram
    MCU Server
   /    |    \
  /     |     \
UserA UserB UserC
        ↓


All streams are **combined into one output stream**.

---

## How It Works

1. Users send media streams to MCU.
2. MCU **decodes each stream**.
3. MCU **mixes audio/video** into one combined layout.
4. MCU **re-encodes and sends a single stream** to each user.

Participants receive only **one video stream**.

---

## Bandwidth Requirement

Client bandwidth remains very low.
Upload = 1 stream
Download = 1 stream

However, **server CPU usage becomes extremely high**.

---

## Advantages

- Very low bandwidth requirement for clients
- Works well on low-power devices
- Simplifies client-side processing
- Consistent video layout

---

## Disadvantages

- Extremely expensive server infrastructure
- High CPU usage due to decoding and re-encoding
- Higher latency
- Less scalable than SFU

---

## Best Use Cases

- Hardware video conferencing systems
- Legacy conferencing platforms
- Low-power devices

---

# Comparison of Architectures

| Feature | P2P | SFU | MCU |
|------|------|------|------|
| Scalability | Poor | Excellent | Moderate |
| Client Upload | High | Low | Low |
| Client Download | Moderate | High | Low |
| Server Cost | None | Medium | Very High |
| Latency | Lowest | Low | Higher |
| Video Processing | Client | None | Server |
| Best For | Small calls | Large meetings | Specialized setups |

---

# Summary

Video conferencing systems use different architectures depending on **scale and infrastructure needs**.

- **P2P** → Simple and low latency, but poor scalability  
- **SFU** → Modern standard for large meetings  
- **MCU** → Server mixes streams but requires heavy computation  

Today, most large-scale platforms rely on **SFU architecture** because it provides the best balance between **scalability, latency, and bandwidth efficiency**.