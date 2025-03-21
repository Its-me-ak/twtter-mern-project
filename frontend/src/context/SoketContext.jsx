import { createContext, useContext, useEffect, useRef, useState } from "react";
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
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [message, setMessage] = useState("")
    const emojiPickerRef = useRef();


    const { data: authUser, isLoading } = useQuery({
        queryKey: ["authUser"],
    })

    useEffect(() => {
        if (authUser?.user?._id) {
            setIsAuthReady(true); // Mark auth as ready when user ID exists
        }
    }, [authUser]);

    useEffect(() => {
        if (!isAuthReady || isLoading) return; // Wait until authUser is ready

        console.log("Setting up socket with clientId:", authUser.user._id);

        const newSocket = io("https://twtter-mern-project.onrender.com", {
            reconnectionAttempts: 5,
            reconnectionDelay: 2000,
            query: { clientId: authUser.user._id },
            transports: ["websocket", "polling"],
            withCredentials: true, 
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
    }, [isAuthReady, isLoading, authUser?.user._id]);

    const handleEmojiClick = (emojiObject) => {
        setMessage((prevMessage) => prevMessage + emojiObject.emoji)
    }

    return (
        <socketContext.Provider value={{
            socket, onlineUsers, message, setMessage, showEmojiPicker, setShowEmojiPicker, handleEmojiClick, emojiPickerRef
        }}>
            {children}
        </socketContext.Provider>
    );
};