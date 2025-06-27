import React from "react";
import Loader from "./Loader";
import { fetchUserPending } from "@/services/post";
import { useUser } from "@/hooks/useUser";
import { useQuery } from "@tanstack/react-query";
import BlogGrid from "./BlogGrid";
import { useSearchParams } from "react-router";
import PaginationComponent from "./PaginationComponent";
import { fetchCategories } from "@/services/category";
import { fetchTags } from "@/services/tag";
import FilterSort from "./FilterSort";

const MyPendingBlogsComponent = () => {
  const { user, isLoading: isLoadingUser } = useUser();

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
    queryKey: [
      "posts",
      "pending",
      currPage,
      sort,
      categoryId,
      tagId,
      `${user.userId}`,
    ],
    queryFn: fetchUserPending,
  });

  if (isLoading || isLoadingCategories || isLoadingTags || isLoadingUser)
    return <Loader />;

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
          <BlogGrid badge={true} authority={authority} blogPosts={blogPosts} years={years} />
          <PaginationComponent
            currPage={currPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <div className="flex-grow flex items-center min-h-screen justify-center p-8">
          <p className="text-xl text-muted-foreground">
            No blog posts found matching your criteria.
          </p>
        </div>
      )}
      {/* <BlogGrid
        blogPosts={blogPosts}
        years={years}
        badge={true}
        authority={authority}
      />

      <PaginationComponent
        totalPages={totalPages}
        onPageChange={handlePageChange}
        currPage={currPage}
      /> */}
    </div>
  );
};

export default MyPendingBlogsComponent;
