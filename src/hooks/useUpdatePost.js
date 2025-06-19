import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editPost } from "@/services/post";

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  const {
    mutate: updatePost,
    isPending: isLoading,
    error,
    data,
  } = useMutation({
    mutationFn: editPost,
    onSuccess: (data) => {
      console.info("post updated", data);
      queryClient.invalidateQueries({
        predicate:(query)=>{
          const firstKeyElement = query.queryKey[0];
          return firstKeyElement !=='user';

        }
      });
    },
    onError: (err) => {
      console.error("error", err);
    },
  });

  return { updatePost, isLoading, error, data };
};
