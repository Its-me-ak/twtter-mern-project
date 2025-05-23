import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Posts from "../../components/common/Posts";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModal";
import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useFollow from "../../hooks/useFollow";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import toast from "react-hot-toast";

const ProfilePage = () => {
    const queryClient = useQueryClient()
    const { username } = useParams()
    const navigate = useNavigate()
    const { data: user, isLoading, refetch, isRefetching } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            try {
                const response = await fetch(`/api/users/profile/${username}`);
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || "Failed to fetch user data");
                return data;
            } catch (error) {
                throw new Error(error)
            }
        },
        retry: false,
    })

    const { data: authUser } = useQuery({
        queryKey: ['authUser']
    })

    const { data: posts } = useQuery({
        queryKey: ["posts"],
        queryFn: async () => {
            const response = await fetch(`/api/posts/${username}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to fetch posts");
            return data;
        }
    })

    const [coverImg, setCoverImg] = useState(null);
    const [profileImg, setProfileImg] = useState(null);
    const [feedType, setFeedType] = useState("posts");

    const coverImgRef = useRef(null);
    const profileImgRef = useRef(null);

    const isMyProfile = authUser.user?._id === user?._id;

    const { followUser, isPending } = useFollow()
    const isFollowing = authUser.user?.following.includes(user?._id)

    // updating user profile
    const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
        mutationFn: async () => {
            try {
                const response = await fetch('/api/users/update', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        coverImg,
                        profileImg
                    }),
                })
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || "Something went wrong");
                return data;
            } catch (error) {
                throw new Error(error)
            }
        },
        onSuccess: () => {
            toast.success('Profile updated successfully')
            setProfileImg(null)
            setCoverImg(null)
            Promise.all([
                queryClient.invalidateQueries({ queryKey: ["authUser"] }),
                queryClient.invalidateQueries({ queryKey: ["user"] }),
            ])
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    useEffect(() => {
        refetch()
    }, [username, refetch]);

    const handleImgChange = (e, state) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                state === "coverImg" && setCoverImg(reader.result);
                state === "profileImg" && setProfileImg(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const formatDate = (dateString) => {
        const options = {
            year: "numeric",
            month: "long",
        }
        return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString))
    }

    return (
        <>
            <div className='flex-[4_4_0]  border-r border-gray-700 min-h-screen '>
                {/* HEADER */}
                {(isLoading || isRefetching) && <ProfileHeaderSkeleton />}
                {!isLoading && !isRefetching && !user && <p className='text-center text-lg mt-4'>User not found</p>}
                <div className='flex flex-col'>
                    {!isLoading && !isRefetching && user && (
                        <>
                            <div className='flex gap-10 px-4 py-2 items-center'>
                                <FaArrowLeft className='w-4 h-4' onClick={() => navigate(-1)} />
                                <div className='flex flex-col'>
                                    <p className='font-bold text-lg'>{user?.fullName}</p>
                                    <span className='text-sm text-slate-500'>{posts?.length} posts</span>
                                </div>
                            </div>
                            {/* COVER IMG */}
                            <div className='relative group/cover'>
                                <img
                                    src={coverImg || user?.coverImg || "/cover.png"}
                                    className='h-52 w-full object-cover'
                                    alt='cover image'
                                />
                                {isMyProfile && (
                                    <div
                                        className='absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200'
                                        onClick={() => coverImgRef.current.click()}
                                    >
                                        <MdEdit className='w-5 h-5 text-white' />
                                    </div>
                                )}

                                <input
                                    type='file'
                                    accept="image/*"
                                    hidden
                                    ref={coverImgRef}
                                    onChange={(e) => handleImgChange(e, "coverImg")}
                                />
                                <input
                                    type='file'
                                    hidden
                                    accept="image/*"
                                    ref={profileImgRef}
                                    onChange={(e) => handleImgChange(e, "profileImg")}
                                />
                                {/* USER AVATAR */}
                                <div className='avatar absolute -bottom-16 left-4'>
                                    <div className='w-32 rounded-full relative group/avatar'>
                                        <img src={profileImg || user?.profileImg || "/avatar-placeholder.png"} />
                                        <div className='absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer'>
                                            {isMyProfile && (
                                                <MdEdit
                                                    className='w-4 h-4 text-white'
                                                    onClick={() => profileImgRef.current.click()}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-end px-4 mt-5'>
                                {isMyProfile && <EditProfileModal authUser={authUser} />}
                                {!isMyProfile && (
                                    <button
                                        className='btn btn-outline rounded-full btn-sm'
                                        onClick={() => followUser(user._id)}
                                    >
                                        {isPending && <LoadingSpinner size="sm" />}
                                        {!isPending && isFollowing && "Unfollow"}
                                        {!isPending && !isFollowing && "Follow"}
                                    </button>
                                )}
                                {(coverImg || profileImg) && (
                                    <button
                                        className='btn btn-primary rounded-full btn-sm text-white px-4 ml-2'
                                        onClick={() => updateProfile()}
                                    >
                                        {isUpdatingProfile ? 'Updating...' : 'Update'}
                                    </button>
                                )}
                            </div>

                            <div className='flex flex-col gap-4 mt-14 px-4'>
                                <div className='flex flex-col'>
                                    <span className='font-bold text-lg'>{user?.fullName}</span>
                                    <span className='text-sm text-slate-500'>@{user?.username}</span>
                                    <span className='text-sm my-1'>{user?.bio}</span>
                                </div>

                                <div className='flex gap-5 flex-wrap'>
                                    {user?.link && (
                                        <div className='flex gap-2 items-center '>
                                            <>
                                                <FaLink className='w-3 h-3 text-slate-500' />
                                                <a
                                                    href={`${user?.link}`}
                                                    target='_blank'
                                                    rel='noreferrer'
                                                    className='text-sm text-blue-500 hover:underline'
                                                >
                                                    {user?.link}
                                                </a>
                                            </>
                                        </div>
                                    )}
                                    <div className='flex gap-2 items-center'>
                                        <IoCalendarOutline className='w-4 h-4 text-slate-500' />
                                        <span className='text-sm text-slate-500'>
                                            Joined {user?.createdAt ? formatDate(user.createdAt) : ''}
                                        </span>
                                    </div>
                                </div>
                                <div className='flex gap-4'>
                                    <div className='flex gap-1 items-center hover:border-b cursor-pointer'>
                                        <Link
                                            to={`/following/${user?.username}`}>
                                            <span className='font-bold text-md'>{user?.following.length}</span>
                                            <span className='text-slate-500 text-md ms-1'>Following</span>
                                        </Link>
                                    </div>
                                    <div className='flex gap-1 items-center hover:border-b cursor-pointer'>
                                        <Link
                                            to={`/following/${user?.username}`}
                                        >
                                            <span className='font-bold text-md'>{user?.followers.length}</span>
                                            <span className='text-slate-500 text-md ms-1'>Followers</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className='flex w-full border-b border-gray-700 mt-4'>
                                <div
                                    className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer'
                                    onClick={() => setFeedType("posts")}
                                >
                                    Posts
                                    {feedType === "posts" && (
                                        <div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary' />
                                    )}
                                </div>
                                <div
                                    className='flex justify-center flex-1 p-3 text-slate-500 hover:bg-secondary transition duration-300 relative cursor-pointer'
                                    onClick={() => setFeedType("likes")}
                                >
                                    Likes
                                    {feedType === "likes" && (
                                        <div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary' />
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    <Posts feedType={feedType} username={username} userId={user?._id} />
                </div>
            </div>
        </>
    );
};
export default ProfilePage;