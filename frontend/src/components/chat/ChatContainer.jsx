import ChatHeader from "./ChatHeader";
import ChatMessageInput from "./ChatMessageInput";
import { useEffect, useRef } from "react";
import { FiMessageCircle } from "react-icons/fi";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import useGetMessage from "../../hooks/useGetMessages";
import useConversation from "../../zustand/useConversation";
import useGetSocketMessage from "../../hooks/useGetSocketMessages";

const ChatContainer = ({ authUser, onSelectUser }) => {
    const { selectedConversation } = useConversation()
    const chatEndPointRef = useRef(null)
    const { messages, loading } = useGetMessage()
    useGetSocketMessage()

    useEffect(() => {
        const timer = setTimeout(() => {
            if (chatEndPointRef.current && messages) {
                chatEndPointRef.current.scrollIntoView({ behavior: "smooth" });
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [messages, selectedConversation]);

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
    if (loading) {
        return (
            <div className="flex-1 flex flex-col overflow-auto custom-scrollbar">
                <ChatHeader selectedConversation={selectedConversation} />
                <MessageSkeleton />
                <ChatMessageInput />

            </div>
        );
    }

    return (
        <div className="h-screen overflow-auto custom-scrollbar">
            <ChatHeader selectedConversation={selectedConversation} onSelectUser={onSelectUser} />
            <div className="mb-20">
                {messages?.length > 0 ? (
                    messages.map((message) => (
                        <div key={message._id} className={`chat mb-2 px-2 ${authUser === message.senderId ? 'chat-end' : 'chat-start'}`}>
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
                        <FiMessageCircle className="w-12 h-12 text-gray-400 mb-4" />
                        <h2 className="text-lg font-bold">No messages yet</h2>
                        <p className="text-sm">
                            Send a message to start the conversation.
                        </p>
                    </div>
                )}
                <div ref={chatEndPointRef} />
            </div>
            <ChatMessageInput selectedConversation={selectedConversation} />
        </div>
    );
};

export default ChatContainer;
