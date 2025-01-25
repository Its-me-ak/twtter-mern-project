import { useEffect } from "react";
import useConversation from "../zustand/useConversation";
import { useSocketContext } from "../context/SoketContext";
import sound from "../assets/notification.mp3";
const useGetSocketMessage = () => {
    const { socket } = useSocketContext();
    const { messages, setMessages } = useConversation();


    useEffect(() => {
        socket?.on("newMessage", (newMessage) => {
            const notification = new Audio(sound);
            notification.play();
            setMessages([...messages, newMessage]);
        });
        return () => {
            socket?.off("newMessage");
        };
    }, [socket, messages, setMessages]);
};
export default useGetSocketMessage;