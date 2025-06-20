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
        predicate:(query)=>{
          return query.queryKey[0]!== 'user' && query.queryKey[0]!== 'categories';
        }
      })
      // queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });

  return { deleteTag, isLoading, error };
};
