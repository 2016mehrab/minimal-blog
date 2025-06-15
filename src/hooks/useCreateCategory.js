import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory as createCategoryService} from '../services/category';

export const useCreateCategory = () => {

  const queryClient = useQueryClient();

  const {
    mutate:createCategory, isPending:isLoading , error, data
  } = useMutation({
    mutationFn:({categoryName})=>createCategoryService({categoryName})
    ,
    onSuccess:(data)=>{
        console.info("category added", data)
        queryClient.invalidateQueries({
            queryKey:['categories']
        });
    },
    onError:(err)=>{
      console.error("error", err)
    }

  })

  return { createCategory, isLoading, error, data};

};
