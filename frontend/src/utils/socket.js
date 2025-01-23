// services/socket.js
import { io } from "socket.io-client";

let socket;

export const connectSocket = (clientId) => {
    // Check if the socket instance already exists and is connected
    if (socket && socket.connected) {
        console.log("Socket already connected:", socket.id);
        return socket;
    }
    
    socket = io("http://localhost:5000", {
        query:  {clientId}
    })
    socket.on("connect", async () => {
        console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", async () => {
        console.log("Socket disconnected.", socket.id);
    });
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};



export const getSocket = () => socket;
