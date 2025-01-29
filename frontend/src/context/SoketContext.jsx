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

    const { data: authUser, isLoading } = useQuery({
        queryKey: ["authUser"],
    })

    useEffect(() => {
        if (isLoading) return
        if (authUser?.user?._id) {
            const timeOut = setTimeout(() => {
                const newSocket = io("https://twtter-mern-project.onrender.com", {
                    reconnectionAttempts: 5,
                    reconnectionDelay: 2000,
                    query: { clientId: authUser.user._id },
                });

                setSocket(newSocket);

                newSocket.on("getOnlineUsers", (users) => {
                    setOnlineUsers(users);
                });

                return () => {
                    newSocket.disconnect();
                    setSocket(null);
                };
            }, 2000);
            return () => clearTimeout(timeOut);
        }
    }, [authUser, isLoading]);

    return (
        <socketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </socketContext.Provider>
    );
};