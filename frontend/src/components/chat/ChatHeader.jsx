import { Link } from "react-router-dom"


const ChatHeader = ({ selectedUserId }) => {
  return (
      <div className="sticky top-0 left-0 z-10 bg-black bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 p-3 flex items-center gap-2">
          <div className="avatar">
              <Link to={`/profile/${selectedUserId.username}`} className="w-8 rounded-full overflow-hidden">
                  <img src={selectedUserId.profileImg || "/avatar-placeholder.png"} alt={selectedUserId.fullName} />
              </Link>
          </div>
          <div>
              <h2 className="text-lg font-bold text-white">{selectedUserId.fullName}</h2>
          </div>
      </div>
  )
}

export default ChatHeader