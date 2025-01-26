import { useState } from "react";
import ChatContainer from "../../components/chat/ChatContainer";
import ChatSidebar from "../../components/chat/ChatSidebar";
import { useQuery } from "@tanstack/react-query";
import WelcomeMessage from "../../components/chat/WelcomeMessage";
import useConversation from "../../zustand/useConversation";

const MessagePage = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const { selectedConversation } = useConversation()

  const { data: authUser } = useQuery({
    queryKey: ["authUser"]
  })

  const toggleView = () => setIsSidebarVisible(!isSidebarVisible);

  return (
    <div className="w-full h-screen flex">
      {/* Sidebar */}
      <div
        className={`w-full md:w-2/5 py-2 px-0 overflow-y-auto border-r border-gray-700 ${isSidebarVisible ? "block" : "hidden"
          } md:block`}
      >
        <ChatSidebar onSelectUser={toggleView} />
      </div>

      {/* Chat Container */}
      <div
        className={`flex flex-col w-full md:w-3/5 border-r border-gray-700 relative ${isSidebarVisible ? "hidden" : "block"
          } md:block`}
      >
        {selectedConversation ? (

          <ChatContainer authUser={authUser.user._id} onSelectUser={toggleView} />

        ) : (
          <WelcomeMessage />
        )}
      </div>
    </div>
  );
};

export default MessagePage;
