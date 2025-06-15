import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategory as deleteCategoryService } from "../services/category";

export const useDeleteCategory= () => {
  const queryClient = useQueryClient();

  const {
    mutate: deleteCategory,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: (id) => deleteCategoryService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return { deleteCategory, isLoading, error };
};
