import { BiRepost } from "react-icons/bi";
import { FaRegHeart, FaHeart, FaRegComment, FaTrash, FaRegBookmark, FaBookmark } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import LoadingSpinner from "./LoadingSpinner";
const Post = ({ post }) => {

    const [comment, setComment] = useState("");
    const { data: authUser } = useQuery({
        queryKey: ["authUser"],
    })
    const postOwner = post.user;

    const isMyPost = authUser.user._id === post.user._id;
    const isLiked = post.likes.includes(authUser.user._id);
    const isBookmarked = post.bookmarkedBy.includes(authUser.user._id);
    const isReposted = post.repostedBy.includes(authUser.user._id);

    const formatDate = (dateString) => {
        const now = new Date();
        const postDate = new Date(dateString);
        const diffInSeconds = Math.floor((now - postDate) / 1000);
        const minutes = Math.floor(diffInSeconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (diffInSeconds < 60) {
            return 'Just now'
        }
        else if (minutes < 60) {
            return `${minutes}m ago`;
        } else if (hours < 24) {
            return `${hours}h ago`;
        } else {
            return `${days}d ago`;
        }
    };

    const queryClient = useQueryClient()
    // Delete Post
    const { mutate: deletePost, isPending: isDeleting } = useMutation({
        mutationFn: async () => {
            try {
                const res = await fetch(`/api/posts/${post._id}`, {
                    method: "DELETE",
                });
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong");
                }
                return data;
            } catch (error) {
                throw new Error(error);
            }
        },
        onSuccess: () => {
            toast.success("Post deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
    });

    // Like Post
    const { mutate: likePost, isPending: isLiking } = useMutation({
        mutationFn: async () => {
            try {
                const response = await fetch(`/api/posts/like/${post._id}`, {
                    method: "POST"
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || "Failed to like post");
                return data;
            } catch (error) {
                throw new Error(error)
            }
        },
        onSuccess: (updatedLikes) => {
            // update the cache directly for that post
            queryClient.setQueryData(["posts"], (oldData) => {
                return oldData.map((p) => {
                    if (p._id === post._id) {
                        return { ...p, likes: updatedLikes };
                    }
                    return p;
                });
            });
        },
        onError: (err) => {
            toast.error(err.message || "Failed to like post");
        }
    })

    // comment post
    const { mutate: commentPost, isPending: isCommenting } = useMutation({
        mutationFn: async () => {
            try {
                const response = await fetch(`/api/posts/comment/${post._id}`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ text: comment })
                })
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || "Failed to comment post");
                return data;
            } catch (error) {
                throw new Error(error)
            }
        },
        onSuccess: () => {
            toast.success('Comment posted successfully')
            setComment('');
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
        onError: (err) => {
            toast.error(err.message || "Failed to comment post");
        }
    })

    // bookmark posts
    const { mutate: bookmarkPost, isPending: isBookmarking } = useMutation({
        mutationFn: async () => {
            try {
                const response = await fetch(`/api/posts/bookmark/${post._id}`, {
                    method: "POST",
                })
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || "Failed to bookmark post");
                console.log('bookmark by ', data);
                return data;
            } catch (error) {
                throw new Error(error)
            }
        },
        onSuccess: (updatedBookmarks) => {
            queryClient.setQueryData(["posts"], (oldData) => {
                return oldData.map((p) => {
                    if (p._id === post._id) {
                        return { ...p, bookmarkedBy: updatedBookmarks };
                    }
                    return p;
                });
            });
        },
        onError: (err) => {
            toast.error(err.message || "Failed to Bookmark post");
        }
    })

    // repost posts
    const { mutate: repostPost, isPending: isReposting } = useMutation({
        mutationFn: async () => {
            try {
                const response = await fetch(`/api/posts/repost/${post._id}`, {
                    method: "POST",
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || "Failed to repost post")
                return data;
            } catch (error) {
                throw new Error(error)
            }
        },
        onSuccess: (updatedData) => {
            queryClient.setQueryData(["posts"], (oldData) => {
                return oldData.map((p) => {
                    if (p._id === post._id) {
                        return { ...p,
                            repostedBy: updatedData.updatedRepost,
                            repostCount: updatedData.repostCount 
                         };
                    }
                    return p;
                });
            });
        },
        onError: (err) => {
            toast.error(err.message || "Failed to repost post");
        }
    })

    const handleRepostPosts = () => {
        if (isReposting) return
        repostPost();
    }

    const handleBookmarkPost = () => {
        if (isBookmarking) return
        bookmarkPost()
    }

    const handleDeletePost = () => {
        deletePost();
    };

    const handlePostComment = (e) => {
        e.preventDefault();
        if (isCommenting) return
        commentPost(comment);
    };

    const handleLikePost = () => {
        if (isLiking) return;
        likePost();
    };

    return (
        <>
            <div className='flex gap-2 items-start p-4 border-b border-gray-700'>
                <div className='avatar static'>
                    <Link to={`/profile/${postOwner.username}`} className='w-8 rounded-full overflow-hidden'>
                        <img src={postOwner.profileImg || "/avatar-placeholder.png"} />
                    </Link>
                </div>
                <div className='flex flex-col flex-1'>
                    <div className='flex gap-2 items-center'>
                        <Link to={`/profile/${postOwner.username}`} className='font-bold'>
                            {postOwner.fullName}
                        </Link>
                        <span className='text-gray-700 flex gap-1 text-sm'>
                            <Link to={`/profile/${postOwner.username}`}>@{postOwner.username}</Link>
                            <span>·</span>
                            <span>{post?.createdAt ? formatDate(post.createdAt) : ''}</span>
                        </span>
                        {isMyPost && (
                            <span className='flex justify-end flex-1'>
                                {!isDeleting && (
                                    <FaTrash className='cursor-pointer hover:text-red-500' onClick={handleDeletePost} />
                                )}
                                {isDeleting && (
                                    <LoadingSpinner size="sm" />
                                )}
                            </span>
                        )}
                    </div>
                    <div className='flex flex-col gap-3 overflow-hidden'>
                        <span>{post.text}</span>
                        {post.image && (
                            <img
                                src={post.image}
                                className='h-80 object-contain rounded-lg border border-gray-700'
                                alt=''
                            />
                        )}
                    </div>
                    <div className='flex justify-between mt-3'>
                        <div className='flex gap-4 items-center w-2/3 justify-between'>
                            <div
                                className='flex gap-1 items-center cursor-pointer group'
                                onClick={() => document.getElementById("comments_modal" + post._id).showModal()}
                            >
                                <FaRegComment className='w-4 h-4  text-slate-500 group-hover:text-sky-400' />
                                <span className='text-sm text-slate-500 group-hover:text-sky-400'>
                                    {post.comments.length}
                                </span>
                            </div>
                            {/* We're using Modal Component from DaisyUI */}
                            <dialog id={`comments_modal${post._id}`} className='modal border-none outline-none'>
                                <div className='modal-box rounded border border-gray-600'>
                                    <h3 className='font-bold text-lg mb-4'>COMMENTS</h3>
                                    <div className='flex flex-col gap-3 max-h-60 overflow-auto'>
                                        {post.comments.length === 0 && (
                                            <p className='text-sm text-slate-500'>
                                                No comments yet 🤔 Be the first one 😉
                                            </p>
                                        )}
                                        {post.comments.map((comment) => (
                                            <div key={comment._id} className='flex gap-2 items-start'>
                                                <div className='avatar'>
                                                    <div className='w-8 rounded-full'>
                                                        <img
                                                            src={comment.user.profileImg || "/avatar-placeholder.png"}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='flex flex-col'>
                                                    <div className='flex items-center gap-1'>
                                                        <span className='font-bold'>{comment.user.fullName}</span>
                                                        <span className='text-gray-700 text-sm'>
                                                            @{comment.user.username}
                                                        </span>
                                                    </div>
                                                    <div className='text-sm'>{comment.text}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <form
                                        className='flex gap-2 items-center mt-4 border-t border-gray-600 pt-2'
                                        onSubmit={handlePostComment}
                                    >
                                        <textarea
                                            className='textarea w-full p-1 rounded text-md resize-none border focus:outline-none  border-gray-800'
                                            placeholder='Add a comment...'
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                        />
                                        <button className='btn btn-primary rounded-full btn-sm text-white px-4'>
                                            {isCommenting ? (
                                                <span className='loading loading-spinner loading-md'></span>
                                            ) : (
                                                "Post"
                                            )}
                                        </button>
                                    </form>
                                </div>
                                <form method='dialog' className='modal-backdrop'>
                                    <button className='outline-none'>close</button>
                                </form>
                            </dialog>
                            <div className='flex gap-1 items-center group cursor-pointer' onClick={handleRepostPosts}>
                                <BiRepost className={`w-6 h-6 ${isReposted ? "text-green-500" : "text-slate-500"}  group-hover:text-green-500`} />
                                <span className={`text-sm ${isReposted ? "text-green-500" : "text-slate-500"}  group-hover:text-green-500`}>
                                    {post.repostCount}
                                </span>
                            </div>
                            <div className='flex gap-1 items-center group cursor-pointer' onClick={handleLikePost}>
                                {!isLiked && (
                                    <FaRegHeart className='w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500' />
                                )}
                                {isLiked && <FaHeart className='w-4 h-4 cursor-pointer text-pink-500 ' />}

                                <span
                                    className={`text-sm group-hover:text-pink-500 ${isLiked ? "text-pink-500" : 'text-slate-500'
                                        }`}
                                >
                                    {post.likes.length}
                                </span>
                            </div>
                        </div>
                        <div className='flex w-1/3 justify-end gap-2 items-center' onClick={handleBookmarkPost}>
                            {!isBookmarked && (
                                <FaRegBookmark className='w-4 h-4 text-slate-500 cursor-pointer hover:text-primary' />
                            )}
                            {isBookmarked && (
                                <FaBookmark className='w-4 h-4 text-primary cursor-pointer' />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default Post;