import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import ChatHeader from "./ChatHeader";
import ChatMessageInput from "./ChatMessageInput";

const ChatContainer = ({ userId, authUser, selectedUserId }) => {
    const { data: chatMessages, isLoading: isMessageLoading, error: isMessageError } = useQuery({
        queryKey: ['chatMessages'],
        queryFn: async () => {
            const response = await fetch(`/api/messages/${userId}`);
            const data = await response.json();
            console.log('messages', data);
            
            if (!response.ok) throw new Error(data.error || "Failed to fetch chat messages");
            return data;
        },
        enabled: !!userId, // Only fetch when userId is available
    });

    if (isMessageLoading) return <p>Loading messages...</p>;
    if (isMessageError) {
        toast.error("Failed to fetch chat messages");
    }

    return (
        <div className="h-screen">
            <ChatHeader selectedUserId= {selectedUserId }/>
            {chatMessages?.length > 0 ? (
                chatMessages.map((message) => (
                    <div key={message._id} className={`mb-2 px-5 ${authUser === message.senderId ? 'chat-end' : 'chat-start' }`}>
                        <div className={`chat-bubble ${authUser === message.senderId ? 'bg-primary' : ''}`}>
                            <p className="text-sm">{message.text}</p>
                        </div>
                        <div className="chat-footer">
                            {message.createdAt}
                        </div>
                    </div>
                ))
            ) : (
                <p>No messages found</p>
            )}
            <ChatMessageInput/>
        </div>
    );
};

export default ChatContainer;
