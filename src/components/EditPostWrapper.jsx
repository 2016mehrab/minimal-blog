import { getPost } from "@/services/post";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useNavigate, useParams } from "react-router";
import PostForm from "./PostForm";
import { fetchTags } from "@/services/tag";
import { fetchCategories } from "@/services/category";
import { useUpdatePost } from "@/hooks/useUpdatePost";
import { toast } from "sonner";

const EditPostWrapper = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { data: blog, isLoading } = useQuery({
    queryFn: () => getPost({ postId }),
    queryKey: ["post", postId],
    enabled: !!postId,
  });

  const { data: availableTags, isLoading: isLoadingTags } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
  });

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
  const { isLoading: isUpdating, updatePost } = useUpdatePost();

  if (postId === null || postId === undefined) {
    return <div>Blog not found.</div>;
  }
  if (isLoading || isLoadingTags || isLoadingCategories)
    return <div>Blog is loading.</div>;

  function handleSubmit(editData) {
    editData["id"] = postId;
    return new Promise((resolve, reject) => {
      updatePost(editData, {
        onSuccess: (data) => {
          console.log("edit done", data);
          toast.success("Edit saved");
          resolve();
        },
        onError: (err) => {
          toast.error("Failed to save edit");
          reject(err);
        },
      });
    });
  }

  return (
    <>
      <PostForm
        onCancel={() => navigate(-1)}
        isSubmitting={isUpdating}
        initialPost={blog}
        onSubmit={handleSubmit}
        categories={categories}
        availableTags={availableTags}
      />
    </>
  );
};

export default EditPostWrapper;
