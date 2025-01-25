import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
// import { useAuthContext } from "./AuthContext";
import { useQuery } from "@tanstack/react-query";
const socketContext = createContext();

// it is a hook.
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
            
            const newSocket = io("http://localhost:5000", {
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