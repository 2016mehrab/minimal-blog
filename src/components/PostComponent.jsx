import React from "react";
import PostForm from "./PostForm";
import { useQuery } from "@tanstack/react-query";
import { fetchTags } from "@/services/tag";
import { fetchCategories } from "@/services/category";
import { useAddPost } from "@/hooks/useAddPost";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useUser } from "@/hooks/useUser";
import Loader from "./Loader";

const PostComponent = () => {
  const { data: tags, isLoading: isLoadingTags } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
  });
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
  const {user, isLoading:isLoadingUser} =useUser();
  const navigate = useNavigate();
  const { createPostFn, isLoading: isAdding } = useAddPost();

  if (isLoadingCategories || isLoadingTags || isLoadingUser) {
    return <Loader/>
  }

  function onSubmit({ title, content, categoryId, tagIds, status }) {
    return new Promise((resolve, reject) => {
      createPostFn(
        { title, content, categoryId, tagIds, status },
        {
          onSuccess: () => {
            toast.success("post added");
            resolve();
          },
          onError: (err) => {
            toast.error("Failed to Add post");
            reject(err);
          },
        }
      );
    });
  }
  function onCancel() {
    navigate("/");
  }

  return (
    <PostForm
      role={[...user.role]}
      onCancel={onCancel}
      isSubmitting={isAdding}
      onSubmit={onSubmit}
      availableTags={tags}
      categories={categories}
    />
  );
};

export default PostComponent;
