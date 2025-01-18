import { useQuery } from "@tanstack/react-query";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import useFollow from "../../../hooks/useFollow";
import { FaArrowLeft } from "react-icons/fa6";


const FollowingAndFollowersPage = () => {
    const { username } = useParams();
    const [activeTab, setActiveTab] = useState("followers");
    const [hoverdUser, setHoveredUser] = useState(null);
    const { followUser } = useFollow()
    const navigate = useNavigate()

    const { data: followingUser, isLoading: followingLoading } = useQuery({
        queryKey: ["followingUser"],
        queryFn: async () => {
            const response = await fetch(`/api/users/following/${username}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to fetch following user data");
            return data;
        },
        enabled: activeTab === "following",
    });

    const { data: followers, isLoading: followersLoading } = useQuery({
        queryKey: ["followersUser"],
        queryFn: async () => {
            const response = await fetch(`/api/users/followers/${username}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to fetch followers user data");
            return data;
        },
        enabled: activeTab === "followers",
    });

    const { data: user } = useQuery({
        queryKey: ['userProfile']
    })

    return (
        <div className="flex-[4_4_0] border-r border-gray-700 min-h-screen p-0">
            <div className='flex gap-10 px-4 py-2 items-center'>
                <FaArrowLeft className='w-4 h-4' onClick={() => navigate(-1)} />
                <div className='flex flex-col'>
                    <p className='font-bold text-lg'>{user?.fullName}</p>
                    <span className='text-sm text-slate-500'>@{user?.username}</span>
                </div>
            </div>
            <div className="flex space-x-4 mb-4">
                <div className='flex w-full border-b border-gray-700 mt-4'>
                    <div
                        className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer'
                        onClick={() => setActiveTab("following")}
                    >
                        Following
                        {activeTab === "following" && (
                            <div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary' />
                        )}
                    </div>
                    <div
                        className='flex justify-center flex-1 p-3 text-slate-500 hover:bg-secondary transition duration-300 relative cursor-pointer'
                        onClick={() => setActiveTab("followers")}
                    >
                        Followers
                        {activeTab === "followers" && (
                            <div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary' />
                        )}
                    </div>
                </div>
            </div>

            {/* Display User List */}
            <div>
                {activeTab === "followers" && (
                    <>
                        {followersLoading ? (
                            <LoadingSpinner size="lg" />
                        ) : (
                            <ul>
                                {followers?.map((user) => (
                                    <li key={user._id} className=" flex space-x-2 mb-4 p-3 hover:bg-[#111]/[0.45]">
                                        <Link to={`/profile/${user.username}`}>
                                            <img
                                                src={user.profileImg || "/avatar-placeholder.png"}
                                                alt={user.username}
                                                className="w-12 h-12 rounded-full object-cover"

                                            />
                                        </Link>
                                        <div className="flex flex-col">
                                            <div className="flex justify-between items-center w-[570px]">
                                                <span>
                                                    <p className="text-white font-medium">{user.fullName}</p>
                                                    <p className="text-gray-500">@{user.username}</p>
                                                </span>
                                                <button
                                                    className={`btn btn-outline rounded-full btn-sm ${hoverdUser === user._id ? "btn-error" : ""
                                                        }`}
                                                    onMouseEnter={() => setHoveredUser(user._id)}
                                                    onMouseLeave={() => setHoveredUser(null)}
                                                    onClick={() => followUser(user._id)}
                                                >
                                                    {hoverdUser === user._id ? "Unfollow" : user._id ? "Following" : "Follow"}
                                                </button>
                                            </div>
                                            <p className="text-gray-400 text-sm">
                                                {user.bio}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </>
                )}

                {activeTab === "following" && (
                    <>
                        {followingLoading ? (
                            <p>Loading following...</p>
                        ) : (
                            <ul>
                                {followingUser?.map((user) => (
                                    <li key={user._id} className=" flex space-x-2 mb-4 p-3 hover:bg-[#111]/[0.45]">
                                        <Link to={`/profile/${user.username}`}>
                                            <img
                                                src={user.profileImg || "/avatar-placeholder.png"}
                                                alt={user.username}
                                                className="w-12 h-12 rounded-full object-cover"

                                            />
                                        </Link>
                                        <div className="flex flex-col">
                                            <div className="flex justify-between items-center w-[570px]">
                                                <span>
                                                    <p className="text-white font-medium">{user.fullName}</p>
                                                    <p className="text-gray-500">@{user.username}</p>
                                                </span>
                                                <button
                                                    className={`btn btn-outline rounded-full btn-sm ${hoverdUser === user._id ? "btn-error" : ""
                                                        }`}
                                                    onMouseEnter={() => setHoveredUser(user._id)}
                                                    onMouseLeave={() => setHoveredUser(null)}

                                                    onClick={() => followUser(user._id)}
                                                >

                                                    {hoverdUser === user._id ? "Unfollow" : user.following ? "Following" : "Follow"}
                                                </button>
                                            </div>
                                            <p className="text-gray-400 text-sm">
                                                {user.bio}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default FollowingAndFollowersPage;
