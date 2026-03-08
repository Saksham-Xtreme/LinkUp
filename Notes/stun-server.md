Here are your simple notes on STUN servers, breaking down exactly how they work and why they are usually free.

STUN Servers: The Simple Breakdown
What it stands for: Session Traversal Utilities for NAT.

The Problem (Why we need them):

Your router assigns your computer a private, "local" IP address (like 192.168.1.5).

Local IPs are completely invisible to the outside internet.

If you want to establish a direct Peer-to-Peer (P2P) connection for video conferencing, the other person's computer cannot reach your local IP.

The Solution (How STUN works):

A STUN server acts like a mirror sitting out on the public internet.

Your computer pings the STUN server to ask, "What is my public-facing IP address and port?"

The STUN server looks at the request and replies with your router's true Public IP.

Your computer takes that Public IP and shares it with the other person's device so they know exactly how to connect to you directly.

Why they are cheap or free:

Low Bandwidth: STUN servers only handle tiny text requests (literally just asking for and returning an IP address).

No Media Relaying: They do not touch your video, audio, or data streams.

Quick Disconnect: The moment your computer finds out its Public IP, it stops talking to the STUN server. The actual heavy data flows directly between you and the other person.