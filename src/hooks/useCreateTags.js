import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTags as createTagsService} from '../services/tag';

export const useCreateTags= () => {

  const queryClient = useQueryClient();

  const {
    mutate:createTags, isPending:isLoading , error, data
  } = useMutation({
    mutationFn:createTagsService
    ,
    onSuccess:(data)=>{
        console.info("tags added", data)
        queryClient.invalidateQueries({
            queryKey:['tags']
        });
    },
    onError:(err)=>{
      console.error("error", err)
    }

  })

  return { createTags, isLoading, error, data};

};
