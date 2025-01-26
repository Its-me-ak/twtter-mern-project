import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import ProfileSkeleton from "../../components/skeletons/ProfileSkeleton";
import { Link } from "react-router-dom";
import useFollow from "../../hooks/useFollow";

const SearchPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [hoveredUser, setHoveredUser] = useState(null);
    const { followUser } = useFollow()

    // Debounce logic to avoid excessive API calls
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    const { data: searchData, isLoading: searchLoading } = useQuery({
        queryKey: ["search", debouncedSearchTerm],
        queryFn: async () => {
            if (!debouncedSearchTerm) return { users: [] }; // Avoid unnecessary API calls for empty queries
            const response = await fetch(`/api/users/search?query=${debouncedSearchTerm}`);
            const data = await response.json();
            console.log("Search result", data);

            if (!response.ok) throw new Error(data.error || "Failed to fetch search data");
            return data;
        },
        enabled: !!debouncedSearchTerm
    });

    const { data: authUser } = useQuery({
        queryKey: ["authUser"]
    })

    return (
        <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
            {/* Header */}
            <div className='flex justify-between items-center p-4 border-b border-gray-700'>
                <p className='font-bold'>Search Users</p>
                <label className="input input-bordered flex items-center gap-2">
                    <input
                        type="text"
                        className="grow"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70">
                        <path
                            fillRule="evenodd"
                            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                            clipRule="evenodd" />
                    </svg>
                </label>
            </div>

            {/* Search Results */}
            {searchLoading ? (
                <ProfileSkeleton />
            ) : (
                <>
                    {searchData?.map((user) => (
                        <div key={user._id} className=" flex w-full gap-2 mb-4 p-3 hover:bg-[#111]/[0.45]">
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
                                        className={`btn btn-outline rounded-full btn-sm ${hoveredUser === user._id && user.followers?.includes(authUser.user._id) ? "btn-error" : ""
                                            }`}
                                        onMouseEnter={() => setHoveredUser(user._id)}
                                        onMouseLeave={() => setHoveredUser(null)}

                                        onClick={() => followUser(user._id)}
                                    >

                                        {hoveredUser === user._id && user.followers?.includes(authUser.user._id)
                                            ? "Unfollow"
                                            : user.followers?.includes(authUser.user._id)
                                                ? "Following"
                                                : "Follow"}
                                    </button>
                                </div>
                                <p className="text-gray-400 text-sm">
                                    {user.bio}
                                </p>
                            </div>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
};

export default SearchPage;
