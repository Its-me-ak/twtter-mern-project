import { useState } from "react";
import ChatContainer from "../../components/chat/ChatContainer";
import ChatSidebar from "../../components/chat/ChatSidebar";
import { useQuery } from "@tanstack/react-query";
import WelcomeMessage from "../../components/chat/WelcomeMessage";
import useConversation from "../../zustand/useConversation";

const MessagePage = () => {
  // const [selectedUserId, setSelectedUserId] = useState(null);
  const { selectedConversation } = useConversation()

  const {data:authUser} = useQuery({
    queryKey: ["authUser"]
  })

  return (
    <div className="w-full h-screen flex">
      {/* Sidebar */}
      <div className="w-2/5 py-2 px-0 overflow-y-auto border-r border-gray-700">
        {/* <ChatSidebar onSelectUser={(userId) => setSelectedUserId(userId)} selectedUserId={selectedUserId?._id} /> */}
        <ChatSidebar   />
      </div>

      {/* Chat Container */}
      <div className="w-3/5 flex flex-col border-r border-gray-700  relative">
        {selectedConversation ? (
          // <ChatContainer userId={selectedUserId?._id} authUser={authUser.user._id} selectedUserId={selectedUserId} />
          <ChatContainer authUser={authUser.user._id}  />
        ) : (
          <WelcomeMessage/>
        )}
      </div>
    </div>
  );
};

export default MessagePage;
