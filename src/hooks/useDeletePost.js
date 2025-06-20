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
      queryClient.invalidateQueries({
        predicate:(q)=>{
          return q.queryKey[0]==="posts" || q.queryKey[0]==="categories" || q.queryKey[0]==="tags"
        }
      })
    },
  });

  return { deleteBlog, isLoading, error };
};
