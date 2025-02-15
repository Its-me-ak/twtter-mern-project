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
    const [isAuthReady, setIsAuthReady] = useState(false);

    const { data: authUser, isLoading } = useQuery({
        queryKey: ["authUser"],
    })
    const SOCKET_URL =
        window.location.hostname === "localhost"
            ? "http://localhost:5000"
            : "https://twtter-mern-project.onrender.com";

    useEffect(() => {
        if (authUser?.user?._id) {
            setIsAuthReady(true); 
        }
    }, [authUser]);

    useEffect(() => {
        if (!isAuthReady || isLoading || !authUser?.user?._id) return;

        console.log("Setting up socket with clientId:", authUser.user._id);

        const newSocket = io(SOCKET_URL, {
            transports: ["websocket"],
            reconnectionAttempts: 5,
            reconnectionDelay: 2000,
            query: { clientId: authUser?.user?._id },
            withCredentials: true
        });

        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (users) => {
            setOnlineUsers(users);
        });

        return () => {
            console.log("Disconnecting socket...");
            newSocket.disconnect();
            setSocket(null);
        };
    }, [isAuthReady, isLoading, authUser?.user?._id,]);


    return (
        <socketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </socketContext.Provider>
    );
};