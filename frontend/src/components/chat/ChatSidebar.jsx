// import { useQuery } from "@tanstack/react-query";
// import toast from "react-hot-toast";
import ProfileSkeleton from "../skeletons/ProfileSkeleton";
import { Link } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
import { MdOutlinePushPin } from "react-icons/md";
import { FiBellOff } from "react-icons/fi";
import { RiFlag2Line, RiDeleteBinLine } from "react-icons/ri";
// import { useEffect, useState } from "react";
// import { io } from "socket.io-client";
import useGetChatUsers from "../../hooks/useGetChatUsers";
import useConversation from "../../zustand/useConversation";
import { useSocketContext } from "../../context/SoketContext";

const ChatSidebar = ({ onSelectUser }) => {
    const { chatUsers, loading } = useGetChatUsers()
    const { selectedConversation, setSelectedConversation } = useConversation()
    console.log(selectedConversation);
    

    const { onlineUsers } = useSocketContext()
    console.log(onlineUsers);

    if (loading) return <ProfileSkeleton />;

    return (
        <div >
            <h1 className="text-xl font-bold mb-4 ms-4">Messages</h1>
            {chatUsers.map((user) => (
                <div
                    key={user._id}
                    className={`cursor-pointer flex justify-between items-center px-2 py-4  duration-300 ${selectedConversation?._id === user._id ? 'bg-gray-600/60 border-r-2 border-cyan-400' : 'hover:bg-gray-700/40'}`}
                    onClick={() => {
                        setSelectedConversation(user)
                        if (onSelectUser) onSelectUser()
                    }
                    }
                >
                    <div className="flex gap-1 items-center">
                        <div className='avatar me-1'>
                            <Link to={`/profile/${user.username}`} className='w-8 rounded-full overflow-hidden'>
                                <img src={user.profileImg || "/avatar-placeholder.png"} />
                            </Link>
                            {onlineUsers.includes(user._id) && (
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-gray-800"></span>
                            )}
                        </div>
                        <h2 className="text-gray-200 font-semibold">{user.fullName}</h2>
                        <p className="text-md font-light text-gray-500">@{user.username}</p>
                    </div>
                    <div>
                        <div className="h-8 w-8 rounded-full  flex justify-center items-center dropdown dropdown-bottom dropdown-left" tabIndex={0} role="button"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box p-0 z-[1] w-52 shadow-[0px_0px_6px_0px_rgba(255,_255,_255,_0.4)] font-bold capitalize">
                                <li className="border-b border-white/30"><a> <MdOutlinePushPin /> pin conversation</a></li>
                                <li className="border-b border-white/30"><a> <FiBellOff /> snooze conversation</a></li>
                                <li className="border-b border-white/30"><a> <RiFlag2Line /> report conversation</a></li>
                                <li className="text-red-700"><a> <RiDeleteBinLine /> delete conversation</a></li>
                            </ul>
                            <BsThreeDots className="text-gray-500 hover:text-primary text-xl" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ChatSidebar;
