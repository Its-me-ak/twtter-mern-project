// import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";

// import { IoSettingsOutline } from "react-icons/io5";
// import { FaUser } from "react-icons/fa";
// import { FaHeart } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";
import Posts from "../../components/common/Posts";
import toast from "react-hot-toast"

const BookmarkPage = ({ userId }) => {
    const { data: bookmarksData, isLoading, error } = useQuery({
        queryKey: ["bookmarks"],
        queryFn: async () => {
            try {
                const response = await fetch(`/api/posts/bookmarks/${userId}`);
                const data = await response.json();
                console.log('All bookmarks ', data);
                if (!response.ok) throw new Error(data.error || "Failed to fetch bookmarked posts");
                return data;
            } catch (error) {
                throw new Error(error.message)
            }
        }
    })
    if (isLoading) return <LoadingSpinner />
    if (error) {
        toast.error(error.message)
    }
    return (
        <>
            <div className='flex-[4_4_0] border-l border-r border-gray-700 min-h-screen'>
                <div className='flex justify-between items-center p-4 border-b border-gray-700'>
                    <p className='font-bold'>All Bookmarkes</p>
                </div>
                {bookmarksData?.length === 0 && <div className='text-center p-4 font-bold'>No notifications 🤔</div>}
                {
                    bookmarksData.map((post) => (
                        <Posts key={post._id} post={post} />
                    ))
                }
            </div>
        </>
    )
}

export default BookmarkPage