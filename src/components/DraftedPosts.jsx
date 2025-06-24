import { fetchDrafts } from "@/services/post";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import BlogGrid from "./BlogGrid";

const DraftedPosts = () => {
  const { data: blogPosts, isLoading } = useQuery({
    queryKey: ["posts", "draft"],
    queryFn: fetchDrafts,
  });
  if (isLoading) {
    return <div>Loading drafts</div>;
  }

  const years = [
    ...new Set(
      blogPosts.map((post) =>
        new Date(post.createdAt)
          .toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
          .slice(0, 16)
      )
    ),
  ]
    .sort()
    .reverse();

  if(blogPosts?.length===0){
    return (
      <div>No drafts available.</div>
    )
  }

  return (
    <BlogGrid years={years} badge= {true } blogPosts={blogPosts}/>

  );
};

export default DraftedPosts;
