import { updateTag } from "@/services/tag";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateTag= () => {
  const queryClient = useQueryClient();

  const {
    mutate: updateTagFn,
     isLoading,
    error,
    data,
  } = useMutation({
    mutationFn: updateTag,
    onSuccess: (data) => {
      console.info("tag name updated", data);
      queryClient.invalidateQueries({
        predicate:(q)=>{
          return q.queryKey[0]==="posts" || q.queryKey[0]==="tags" || q.queryKey[0] ==="post";
        }
      })
    },
    onError: (err) => {
      console.error("error", err);
    },
  });

  return { updateTagFn, isLoading, error, data };
};
