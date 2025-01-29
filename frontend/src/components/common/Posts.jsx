import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react";

const Posts = ({ feedType, username, userId }) => {
  const getPostEndPont = () => {
    switch (feedType) {
      case "forYou":
        return "/api/posts/all-posts";
      case "following":
        return "/api/posts/following";
      case "posts":
        return `/api/posts/user-post/${username}`;
      case "likes":
        return `/api/posts/likes/${userId}`;
      default:
        return "/api/posts/all-posts"
    }
  }

  const POST_URI = getPostEndPont();

  const { data: posts, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await fetch(POST_URI);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch posts");
      return data;
    }
  })

  useEffect(() => {
    refetch()
  }, [feedType, refetch, username])

  return (
    <>
      {(isLoading || isFetching) && (
        <div className='flex flex-col justify-center'>
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && !isFetching && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
      {!isLoading && !isFetching && posts && (
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