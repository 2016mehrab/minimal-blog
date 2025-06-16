import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCategory as updateCategoryService } from "../services/category";

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  const {
    mutate: updateCategory,
    isPending: isLoading,
    error,
    data,
  } = useMutation({
    mutationFn: ({ categoryId, categoryName }) =>
      updateCategoryService({ categoryId, categoryName }),
    onSuccess: (data) => {
      console.info("category updated", data);
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
    onError: (err) => {
      console.error("error", err);
    },
  });

  return { updateCategory, isLoading, error, data };
};
