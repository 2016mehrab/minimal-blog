
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "@/services/post";

export const useAddPost= () => {

  const queryClient = useQueryClient();

  const {
    mutate:createPostFn, isPending:isLoading , error, data
  } = useMutation({
    mutationFn:createPost
    ,
    onSuccess:(data)=>{
        console.info("post added", data)
        queryClient.invalidateQueries({
            queryKey:['posts']
        });
    },
    onError:(err)=>{
      console.error("error", err)
    }

  })

  return { createPostFn, isLoading, error, data};

};
