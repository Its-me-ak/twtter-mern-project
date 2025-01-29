import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useQuery } from "@tanstack/react-query";
const socketContext = createContext();

export const useSocketContext = () => {
    return useContext(socketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    
const {data: authUser} = useQuery({
    queryKey: ["authUser"],
})

    useEffect(() => {
        if (authUser) {
            console.log("logging");
            
            const newSocket = io("https://twtter-mern-project.onrender.com", {
                reconnectionAttempts:5,
                reconnectionDelay: 2000,
                query: { clientId: authUser?.user?._id },
            });
            setSocket(newSocket);

            // Listen for online users
            newSocket.on("getOnlineUsers", (users) => {
                setOnlineUsers(users);
            });

            // Clean up on unmount or logout
            return () => {
                newSocket.disconnect();
                setSocket(null);
            };
        }
    }, [authUser]);

    return (
        <socketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </socketContext.Provider>
    );
};