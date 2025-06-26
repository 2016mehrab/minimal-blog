import { fetchDrafts } from "@/services/post";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import BlogGrid from "./BlogGrid";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import PaginationComponent from "./PaginationComponent";
import { useSearchParams } from "react-router";
import Loader from "./Loader";

const DraftedPosts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currPage = searchParams.get("page")
    ? Number(searchParams.get("page"))
    : 1;

  const { data, isLoading } = useQuery({
    queryKey: ["posts", "draft", currPage ],
    queryFn: fetchDrafts,
  });

  if (isLoading) {
    return <Loader />;
  }
  const blogPosts = data?.content || [];
  const totalPages = data?.totalPages || 0;

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

  if (blogPosts?.length === 0) {
    return <div>No drafts available.</div>;
  }
  function handlePageChange(newPage) {
    if (newPage >= 1 && newPage <= totalPages) {
      searchParams.set("page", newPage);
      setSearchParams(searchParams);
    }
  }

  return (
    <div>
      <BlogGrid years={years} badge={true} blogPosts={blogPosts} />

      <PaginationComponent
        currPage={currPage}
        onPageChange={handlePageChange}
        totalPages={totalPages}
      />
    </div>
  );
};

export default DraftedPosts;
