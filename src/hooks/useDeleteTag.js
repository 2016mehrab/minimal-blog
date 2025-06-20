import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTag as deleteTagService } from "../services/tag";

export const useDeleteTag= () => {
  const queryClient = useQueryClient();

  const {
    mutate: deleteTag,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: deleteTagService,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate:(q)=>{
          return q.queryKey[0]==="posts" || q.queryKey[0]==="tags" || q.queryKey[0] ==="post";
        }
      })
      // queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });

  return { deleteTag, isLoading, error };
};
