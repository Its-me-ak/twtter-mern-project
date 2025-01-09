import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import {useQuery} from "@tanstack/react-query"

const Posts = ({feedType}) => {
  const isLoading = false;

  const getPostEndPont = () => {
    switch (feedType) {
      case "forYou":
        return "/api/posts/all-posts";
      
      case "following":
      return "/api/posts/following"
      default:
      return "/api/posts/all"
    }
  }

  const POST_URI = getPostEndPont();
  const {data:posts} = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await fetch(POST_URI);
      const data = await response.json();
      console.log('posts data:', data);
      
      if (!response.ok) throw new Error(data.error || "Failed to fetch posts");
      return data;
    }
  })

  return (
    <>
      {isLoading && (
        <div className='flex flex-col justify-center'>
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
      {!isLoading && posts && (
        <div>
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};
export default Posts;