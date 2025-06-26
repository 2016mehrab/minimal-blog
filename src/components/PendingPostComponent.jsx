import { fetchPending } from "@/services/post";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import BlogGrid from "./BlogGrid";
import { useUser } from "@/hooks/useUser";
import PaginationComponent from "./PaginationComponent";
import { useSearchParams } from "react-router";
import Loader from "./Loader";

const PendingPostComponent = () => {
  const { user, isLoading: isLoadingUser } = useUser();
  const [searchParams, setSearchParams] = useSearchParams();

  const currPage = searchParams.get("page")
    ? Number(searchParams.get("page"))
    : 1;

  const { data, isLoading } = useQuery({
    queryKey: ["posts", "pending", currPage],
    queryFn: fetchPending,
  });

  if (isLoading || isLoadingUser) {
    return <Loader />;
  }

  const authority =
    user.role.includes("ROLE_ADMIN") ||
    user.role.includes("ROLE_EDITOR") ||
    false;
  const blogPosts = data?.content || [];
  const totalPages = data?.totalPages || 0;

  if (blogPosts.length === 0) {
    <div>Nothing to show.</div>;
  }

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
  function handlePageChange(newPage) {
    if (newPage >= 1 && newPage <= totalPages) {
      searchParams.set("page", newPage);
      setSearchParams(searchParams);
    }
  }

  return (
    <div>
      <BlogGrid
        blogPosts={blogPosts}
        years={years}
        badge={true}
        authority={authority}
      />
      <PaginationComponent
        totalPages={totalPages}
        onPageChange={handlePageChange}
        currPage={currPage}
      />
    </div>
  );
};

export default PendingPostComponent;
