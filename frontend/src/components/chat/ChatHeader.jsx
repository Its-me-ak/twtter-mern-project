import { Link } from "react-router-dom"
import { FaArrowLeft } from "react-icons/fa6";

const ChatHeader = ({ selectedConversation, onSelectUser }) => {
  return (
      <div className="sticky top-0 left-0 z-10 bg-black bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 py-3 px-1 flex items-center gap-2">
          <button
              className="md:hidden p-2 flex items-center gap-2 text-gray-500 hover:text-white"
              onClick={onSelectUser}
            >
              <FaArrowLeft className="w-5 h-5" />
            </button>
          <div className="avatar">
              <Link to={`/profile/${selectedConversation.username}`} className="w-8 rounded-full overflow-hidden">
                  <img src={selectedConversation.profileImg || "/avatar-placeholder.png"} alt={selectedConversation.fullName} />
              </Link>
          </div>
          <div>
              <h2 className="text-lg font-bold text-white">{selectedConversation.fullName}</h2>
          </div>
      </div>
  )
}

export default ChatHeader