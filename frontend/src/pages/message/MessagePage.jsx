import { useState } from "react";
import ChatContainer from "../../components/chat/ChatContainer";
import ChatSidebar from "../../components/chat/ChatSidebar";
import { useQuery } from "@tanstack/react-query";
import WelcomeMessage from "../../components/chat/WelcomeMessage";

const MessagePage = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);

  const {data:authUser} = useQuery({
    queryKey: ["authUser"]
  })
  return (
    <div className="w-full h-screen flex">
      {/* Sidebar */}
      <div className="w-2/5 py-2 px-0 overflow-y-auto border-r border-gray-700">
        <ChatSidebar onSelectUser={(userId) => setSelectedUserId(userId)} selectedUserId={selectedUserId?._id} />
      </div>

      {/* Chat Container */}
      <div className="w-3/5 flex flex-col border-r border-gray-700  relative">
        {selectedUserId ? (
          <ChatContainer userId={selectedUserId?._id} authUser={authUser.user._id} selectedUserId={selectedUserId} />
        ) : (
          <WelcomeMessage/>
        )}
      </div>
    </div>
  );
};

export default MessagePage;
