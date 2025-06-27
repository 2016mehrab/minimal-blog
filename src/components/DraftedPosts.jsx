import { fetchDrafts } from "@/services/post";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import BlogGrid from "./BlogGrid";

import { useSearchParams } from "react-router";
import Loader from "./Loader";
import PaginationComponent from "./PaginationComponent";
import { fetchCategories } from "@/services/category";
import { fetchTags } from "@/services/tag";
import FilterSort from "./FilterSort";
import NoResultsFound from "./NoResultsFound";

const DraftedPosts = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: categories = [], isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const { data: tags = [], isLoading: isLoadingTags } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
  });

  const currPage = searchParams.get("page")
    ? Number(searchParams.get("page"))
    : 1;

  const categoryId =
    searchParams.get("categoryId") === "all-categories"
      ? ""
      : searchParams.get("categoryId") || "";
  const tagId =
    searchParams.get("tagId") === "all-tags"
      ? ""
      : searchParams.get("tagId") || "";
  const sort = searchParams.get("sort") || "createdAt,desc";

  const { data, isLoading } = useQuery({
    queryKey: ["posts", "draft", currPage, sort, categoryId, tagId],
    queryFn: fetchDrafts,
  });

  if (isLoading || isLoadingCategories || isLoadingTags) return <Loader />;

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


  function handlePageChange(newPage) {
    if (newPage >= 1 && newPage <= totalPages) {
      searchParams.set("page", newPage.toString());
      setSearchParams(searchParams);
    }
  }

  function handleCategoryChange(newCategoryId) {
    if (newCategoryId === "all-categories") {
      searchParams.delete("categoryId");
    } else {
      searchParams.set("categoryId", newCategoryId);
    }
    searchParams.set("page", "1");
    setSearchParams(searchParams);
  }

  function handleTagChange(newTagId) {
    if (newTagId === "all-tags") {
      searchParams.delete("tagId");
    } else {
      searchParams.set("tagId", newTagId);
    }
    searchParams.set("page", "1");
    setSearchParams(searchParams);
  }
  function handleSortChange(newSort) {
    searchParams.set("sort", newSort);
    searchParams.set("page", "1");
    setSearchParams(searchParams);
  }

  function clearFilters() {
    searchParams.delete("categoryId");
    searchParams.delete("tagId");
    searchParams.set("page", "1");
    setSearchParams(searchParams);
  }

  return (
    <div>
      <FilterSort
        categories={categories}
        categoryId={categoryId}
        handleCategoryChange={handleCategoryChange}
        clearFilters={clearFilters}
        handleSortChange={handleSortChange}
        handleTagChange={handleTagChange}
        sort={sort}
        tagId={tagId}
        tags={tags}
      />

       {blogPosts.length > 0 ? (
        <>
          <BlogGrid badge={true}  blogPosts={blogPosts} years={years} />
          <PaginationComponent
            currPage={currPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <NoResultsFound/>
      )}
      {/* <BlogGrid years={years} badge={true} blogPosts={blogPosts} />

      <PaginationComponent
        currPage={currPage}
        onPageChange={handlePageChange}
        totalPages={totalPages}
      /> */}
    </div>
  );
};

export default DraftedPosts;
