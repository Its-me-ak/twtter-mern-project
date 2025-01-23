import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// Track connected clients
const userSocketMap = {};

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:6969"], 
        methods: ["GET", "POST"],
    },
});

// Function to get receiver's socket ID
export function getReceiverSocketId(clientId) {
    return userSocketMap[clientId];
}

// Handle socket connections
io.on("connection", (socket) => {
    const clientId = socket.handshake.query?.clientId || socket.id;

    // Store the mapping of clientId to socket.id
    userSocketMap[clientId] = socket.id;
    console.log(`A user connected: ${socket.id}, Client ID: ${clientId}`);

    // Handle receiving messages
    socket.on("send_message", (messageData) => {
        const { recipientId, message } = messageData;
        const receiverSocketId = getReceiverSocketId(recipientId); // Normalize IDs

        console.log("Recipient ID:", recipientId);
        console.log("Receiver Socket ID:", receiverSocketId);
        console.log("Current userSocketMap:", userSocketMap);
        if (receiverSocketId) {
            // Send the message to the recipient
            io.to(receiverSocketId).emit("receive_message", {
                message,
                senderId: clientId,
            });
            console.log(`Message sent to ${recipientId}: ${message}`);
        } else {
            console.log("Recipient is offline or not found.");
        }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        // Remove the client from the userSocketMap
        delete userSocketMap[clientId];
    });
});

export { io, server, app };
