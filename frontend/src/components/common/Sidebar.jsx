import XSvg from "../svg/X";

import { MdHomeFilled, MdOutlineMail } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser, FaRegBookmark, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { disconnectSocket } from "../../utils/socket";

const Sidebar = () => {
    const queryClient = useQueryClient()
    const { mutate: logoutMutate } = useMutation({
        mutationFn: async () => {
            const response = await fetch('/api/auth/logout', {
                method: "POST",
            })
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to logged out");
        },
        onSuccess: () => {
            toast.success('Logged out successfully')
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
            disconnectSocket()
        },
        onError: (err) => {
            toast.error(err.message)
        }
    })

    const { data: authUser } = useQuery({
        queryKey: ["authUser"]
    })


    return (
        <div className='md:flex-[2_2_0] w-18 max-w-52'>
            <div className='sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full'>
                <Link to='/' className='flex justify-center md:justify-start'>
                    <XSvg className='px-2 w-12 h-12 rounded-full fill-white hover:bg-stone-900' />
                </Link>
                <ul className='flex flex-col gap-3 mt-4'>
                    <li className='flex justify-center md:justify-start'>
                        <Link
                            to='/'
                            className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
                        >
                            <MdHomeFilled className='w-8 h-8' />
                            <span className='text-lg hidden md:block'>Home</span>
                        </Link>
                    </li>
                    <li className='flex justify-center md:justify-start'>
                        <Link
                            to='/notifications'
                            className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
                        >
                            <IoNotifications className='w-6 h-6' />
                            <span className='text-lg hidden md:block'>Notifications</span>
                        </Link>
                    </li>

                    <li className='flex justify-center md:justify-start'>
                        <Link
                            to={`/profile/${authUser.user?.username}`}
                            className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
                        >
                            <FaUser className='w-6 h-6' />
                            <span className='text-lg hidden md:block'>Profile</span>
                        </Link>
                    </li>
                    <li className='flex justify-center md:justify-start'>
                        <Link to={'/bookmarkes'}
                            className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'>
                            <FaRegBookmark className='w-6 h-6' />
                            <span className='text-lg hidden md:block'>Bookmarks</span>
                        </Link>
                    </li>
                    <li className='flex justify-center md:justify-start'>
                        <Link to={'/messages'}
                            className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'>
                            <MdOutlineMail className='w-6 h-6' />
                            <span className='text-lg hidden md:block'>Messages</span>
                        </Link>
                            </li>
                        <li className='flex justify-center md:justify-start'>
                            <Link to={'/search'}
                                className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'>
                                <FaSearch className='w-6 h-6' />
                                <span className='text-lg hidden md:block'>Search</span>
                            </Link>
                    </li>
                </ul>
                {authUser.user && (
                    <div
                        className='mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full cursor-pointer dropdown dropdown-top dropdown-end'
                    >
                        <ul tabIndex={0} className="dropdown-content menu bg-black rounded-box md:z-[1] w-52 shadow shadow-white absolute left-2 z-50 md:static md:left-0">
                            <li>
                                <a className="font-bold text-md" 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        logoutMutate();
                                    }}
                                >
                                    Log out @{authUser.user.username}
                                </a>
                            </li>
                        </ul>
                        <div className='avatar hidden md:inline-flex' tabIndex={0} role="button" >
                            <div className='w-8 rounded-full'>
                                <img src={authUser.user?.profileImg || "/avatar-placeholder.png"} />
                            </div>
                        </div>
                        <div className='flex md:justify-between justify-center items-center flex-1' tabIndex={0} role="button" >
                            <div className='hidden md:block'>
                                <p className='text-white font-bold text-sm w-20 truncate'>{authUser.user?.fullName}</p>
                                <p className='text-slate-500 text-sm'>@{authUser.user?.username}</p>
                            </div>
                            <BsThreeDots
                                className='w-5 h-5' />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default Sidebar;