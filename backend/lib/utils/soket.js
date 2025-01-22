import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// Track connected clients
const connectedSockets = new Map();

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:6969"],
    },
});

// Handle socket connections
io.on("connection", (socket) => {
    const clientId = socket.handshake.query?.clientId || socket.id;

    // Check if this client already has an active socket
    if (connectedSockets.has(clientId)) {
        console.log(`Replacing existing connection for client: ${clientId}`);
        const existingSocket = connectedSockets.get(clientId);
        existingSocket.disconnect(true); // Disconnect the old socket
    }

    // Store the new socket
    connectedSockets.set(clientId, socket);
    console.log(`A user connected: ${socket.id}, Client ID: ${clientId}`);

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        connectedSockets.delete(clientId); // Remove the socket from the map
    });
});

export { io, server, app };
