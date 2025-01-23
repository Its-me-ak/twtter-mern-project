import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import ChatHeader from "./ChatHeader";
import ChatMessageInput from "./ChatMessageInput";
import { useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import { connectSocket } from "../../utils/socket";

const ChatContainer = ({ userId, authUser, selectedUserId }) => {
    const chatEndPointRef = useRef(null)
    const { data: chatMessages, isLoading: isMessageLoading, error: isMessageError, refetch } = useQuery({
        queryKey: ['chatMessages'],
        queryFn: async () => {
            const response = await fetch(`/api/messages/${userId}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to fetch chat messages");
            return data;
        },
        enabled: !!userId, // Only fetch when userId is available
    });
    useEffect(() => {
        refetch() // Fetch new messages when component re-renders or userId changes
    }, [userId, refetch])

    useEffect(() => {
        const clientId = authUser
        const socket = connectSocket(clientId);
        // Listen for real-time messages
        socket.on("receive_message", async (newMessage) => {
            console.log("Received a new message:", newMessage);
            refetch();
        });

        return () => {
            socket.off("receive_message");
        };
    }, [refetch, userId, authUser]);

    useEffect(() => {
        if (chatEndPointRef.current && chatMessages) {
            chatEndPointRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
            });
        }
    }, [chatMessages]);

    const formatMessageTime = (dateString) => {
        const now = new Date();
        const messageDate = new Date(dateString);

        const timeDifference = now - messageDate;
        // If the time difference is less than 1 day (24 hours)
        if (timeDifference < 24 * 60 * 60 * 1000) {
            return new Intl.DateTimeFormat('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
            }).format(messageDate);
        }

        // Otherwise, return the formatted date like in the image
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        }).format(messageDate);
    };
    if (isMessageLoading) {
        return (
            <div className="flex-1 flex flex-col overflow-auto custom-scrollbar">
                <ChatHeader selectedUserId={selectedUserId} />
                <MessageSkeleton />
                <ChatMessageInput />

            </div>
        );
    }

    if (isMessageError) {
        toast.error("Failed to fetch chat messages");
    }

    return (
        <div className="h-screen overflow-auto custom-scrollbar">
            <ChatHeader selectedUserId={selectedUserId} />
            <div className="mb-20">
                {chatMessages?.length > 0 ? (
                    chatMessages.map((message) => (
                        <div key={message._id} className={`mb-2 px-5 ${authUser === message.senderId ? 'chat-end' : 'chat-start'}`}>
                            <div
                                className={`chat-bubble rounded-md flex flex-col ${message.image
                                    ? 'bg-transparent p-0'
                                    : authUser === message.senderId
                                        ? 'bg-primary'
                                        : ''
                                    }`}
                            >
                                {message.image && (
                                    <img
                                        src={message.image}
                                        alt={message.senderUsername}
                                        className="w-full h-full object-cover rounded-2xl"
                                    />
                                )}
                                {message.text && <p>{message.text}</p>}
                            </div>
                            <div className="chat-footer">
                                {formatMessageTime(message.createdAt)}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-600">
                        <MessageCircle className="w-12 h-12 text-gray-400 mb-4" />
                        <h2 className="text-lg font-bold">No messages yet</h2>
                        <p className="text-sm">
                            Send a message to start the conversation.
                        </p>
                    </div>
                )}
            </div>
            <ChatMessageInput selectedUserId={selectedUserId}/>
            <div ref={chatEndPointRef} />
        </div>
    );
};

export default ChatContainer;
