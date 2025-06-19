import { useQuery } from "@tanstack/react-query";
import React from "react";
import BlogGrid from "./BlogGrid";
import { fetchPosts } from "@/services/post";

const PublishedPosts = () => {
  const { data: blogPosts, isLoading } = useQuery({
    queryKey: ["posts", "published"],
    queryFn: fetchPosts,
  });
  if (isLoading) return <div>Loading posts.</div>;
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
  return <BlogGrid blogPosts={blogPosts} years={years} />;
};

export default PublishedPosts;
