import React from 'react'
import Loader from './Loader';
import { fetchUserPending } from '@/services/post';
import { useUser } from '@/hooks/useUser';
import { useQuery } from '@tanstack/react-query';
import BlogGrid from './BlogGrid';

const MyPendingBlogsComponent = () => {
  const{ user, isLoading:isLoadingUser} =useUser();
  const { data, isLoading } = useQuery({
    queryKey: ["posts", "pending",`${user.userId}`],
    queryFn: fetchUserPending,
  });

  if (isLoading || isLoadingUser) {
    return (
        <Loader/>
    );
  }

  const authority= user.role.includes("ROLE_ADMIN") || user.role.includes("ROLE_EDITOR") || false;
  const blogPosts = data.content;

  const years = [
    ...new Set(
      blogPosts.map((post) =>
        new Date(post.createdAt)
          .toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            // day: "numeric",
          })
          .slice(0, 16)
      )
    ),
  ]
    .sort()
    .reverse();

  return <BlogGrid blogPosts={blogPosts} years={years} badge={true} authority={authority} />

}

export default MyPendingBlogsComponent