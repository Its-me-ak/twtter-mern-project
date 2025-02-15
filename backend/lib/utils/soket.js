import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);



const io = new Server(server, {
    cors: {
        origin: ["http://localhost:6969"],
    },
});

// Function to get receiver's socket ID
export function getReceiverSocketId(clientId) {
    return userSocketMap[clientId];
}

// Track connected clients
const userSocketMap = {};

// Handle socket connections
io.on("connection", (socket) => {
    // Use client-provided ID if available, else default to socket.id
    const clientId = socket.handshake.query?.clientId || socket.id;

    // Store the mapping of clientId to socket.id
    userSocketMap[clientId] = socket.id;

    console.log(`User connected: ${clientId}, Socket ID: ${socket.id}`);

    // Emit online users to all clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${clientId}, Socket ID: ${socket.id}`);
        delete userSocketMap[clientId]; // Remove client from map
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});


export { io, server, app };
