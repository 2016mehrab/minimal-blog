import { fetchPending } from "@/services/post";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Spinner } from "./ui/shadcn-io/spinner";
import BlogGrid from "./BlogGrid";
import { useUser } from "@/hooks/useUser";

const PendingPostComponent = () => {
  const { user, isLoading: isLoadingUser } = useUser();
  const { data, isLoading } = useQuery({
    queryKey: ["posts", "pending"],
    queryFn: fetchPending,
  });

  if (isLoading || isLoadingUser) {
    return (
      <div className="flex w-full h-screen items-center justify-center gap-4 bg-secondary">
        <Spinner />
      </div>
    );
  }

  const authority =
    user.role.includes("ROLE_ADMIN") ||
    user.role.includes("ROLE_EDITOR") ||
    false;
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
  return (
    <>
      <BlogGrid
        blogPosts={blogPosts}
        years={years}
        badge={true}
        authority={authority}
      />

    </>
  );
};

export default PendingPostComponent;
