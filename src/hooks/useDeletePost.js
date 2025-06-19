import { deletePost } from "@/services/post";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeletePost= () => {
  const queryClient = useQueryClient();

  const {
    mutate: deleteBlog,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return { deleteBlog, isLoading, error };
};
