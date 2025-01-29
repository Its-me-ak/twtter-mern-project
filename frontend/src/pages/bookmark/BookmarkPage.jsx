import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast"
import Post from "../../components/common/Post";
import PostSkeleton from "../../components/skeletons/PostSkeleton";

const BookmarkPage = ({ userId }) => {
    const { data: bookmarksData, isLoading, error } = useQuery({
        queryKey: ["bookmarks"],
        queryFn: async () => {
            try {
                const response = await fetch(`/api/posts/bookmarks/${userId}`);
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || "Failed to fetch bookmarked posts");
                return data;
            } catch (error) {
                throw new Error(error.message)
            }
        }
    })
    if (isLoading) return <PostSkeleton />
    if (error) {
        toast.error(error.message)
    }
    return (
        <>
            <div className='flex-[4_4_0] border-l border-r border-gray-700 min-h-screen'>
                <div className='flex justify-between items-center p-4 border-b border-gray-700'>
                    <p className='font-bold'>All Bookmarkes</p>
                </div>
                {bookmarksData?.length === 0 && <div className='text-center p-4 font-bold'>No Bookmarked Post 🤔</div>}
                {
                    bookmarksData.map((bookmark) => {
                        return <Post key={bookmark._id} post={bookmark} />
                    })
                }
            </div>
        </>
    )
}

export default BookmarkPage