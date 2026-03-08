import { Server } from "socket.io";

let connections = {};
let messages = {};
let timeOnline = {};

export const connectToSocket = (server) => {

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // 1. User joins the meeting room
    socket.on("join-call", (path) => {
      if (connections[path] === undefined) {
        connections[path] = [];
      }
      
      connections[path].push(socket.id);
      timeOnline[socket.id] = new Date();

      // Notify everyone in the room (including the new user) that someone joined
      for (let a = 0; a < connections[path].length; a++) {
        io.to(connections[path][a]).emit("user-joined", socket.id, connections[path]);
      }

      // Restore chat history for the newly joined user
      if (messages[path] !== undefined) {
        for (let a = 0; a < messages[path].length; ++a) {
          io.to(socket.id).emit(
            "chat-message", 
            messages[path][a]['data'],
            messages[path][a]['sender'], 
            messages[path][a]['socket-id-sender']
          );
        }
      }
    });

    // 2. WebRTC Signaling (Offers, Answers, ICE Candidates)
    socket.on("signal", (toID, message) => {
      io.to(toID).emit("signal", socket.id, message); 
    });

    // 3. Handle Chat Messages
    socket.on("chat-message", (data, sender) => {
      // Find which room this socket belongs to efficiently
      let matchingRoom = null;
      for (const [room, clients] of Object.entries(connections)) {
        if (clients.includes(socket.id)) {
          matchingRoom = room;
          break;
        }
      }

      if (matchingRoom) {
        if (messages[matchingRoom] === undefined) {
          messages[matchingRoom] = [];
        }

        messages[matchingRoom].push({
          'sender': sender, 
          "data": data, 
          "socket-id-sender": socket.id 
        });

        // FIXED: Removed the undefined 'key' variable that was crashing the server
        console.log("message in room", matchingRoom, ":", sender, data);

        // Broadcast message to everyone in the room
        connections[matchingRoom].forEach((elem) => {
          io.to(elem).emit("chat-message", data, sender, socket.id);
        });
      }
    });

    // 4. Handle Disconnects Safely
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);

      // FIXED: Clean, efficient loop without JSON stringify hacks
      for (const [room, clients] of Object.entries(connections)) {
        const index = clients.indexOf(socket.id);

        if (index !== -1) {
          // Notify remaining users that this person left
          for (let a = 0; a < clients.length; a++) {
            if (clients[a] !== socket.id) { // Don't send event to the dead socket
              io.to(clients[a]).emit('user-left', socket.id);
            }
          }

          // Remove the user from the array
          clients.splice(index, 1);

          // Clean up the room entirely if it's empty to save memory
          if (clients.length === 0) {
            delete connections[room];
            delete messages[room]; // Free up memory from old chats too
          }
          
          break; // Exit loop early once we found and removed the user
        }
      }

      // Clean up the timestamp
      delete timeOnline[socket.id];
    });

  });

  return io;
};