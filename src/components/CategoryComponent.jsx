import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CreateCategoryForm from "./CreateCategoryForm";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/services/category";
import { Button } from "./ui/button";
import { PenIcon, Trash } from "lucide-react";
import { useDeleteCategory } from "@/hooks/useDeleteCategory";
import { toast } from "sonner";

const CategoryComponent = () => {
  const {
    data: categories,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
  const { deleteCategory, isLoading: isDeleting } = useDeleteCategory();

  if (isLoading)
    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Categories</h2>
          <CreateCategoryForm />
        </div>
        <p>Loading categories...</p>
      </>
    );
  if (isError) {
    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Categories</h2>
          <CreateCategoryForm />
        </div>
        {/* Display the error message from the thrown Error object */}
        <p className="text-red-500">
          Error: {error?.message || "Failed to load categories."}
        </p>
      </>
    );
  }

  function handleDelete(id) {
    deleteCategory(id, {
      onSuccess: () => toast.success("Category deleted"),
      onError: (err) =>
        toast.error(err.message || "Failed to deleted category"),
    });
  }

  return (
    <>
      <div className="flex justify-between">
        <h2>Categories</h2>
        <CreateCategoryForm />
      </div>
      <Table>
        <TableCaption>A list of available categories</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-muted-foreground text-center">
              NAME
            </TableHead>
            <TableHead className={"text-center text-muted-foreground"}>
              POST COUNT
            </TableHead>
            <TableHead className="text-center text-muted-foreground">
              ACTIONS
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories && categories?.length > 0 ? (
            categories.map(({ id, name, postCount }) => (
              <TableRow key={id}>
                <TableHead className="w-[100px]  text-center">
                  {name}{" "}
                </TableHead>
                <TableHead className={"text-center"}>{postCount} </TableHead>
                <TableHead className=" flex justify-center items-center  gap-1.5 outline-2 outline-emerald-600">
                  <Button>
                    {/* Add fill-none to prevent the icon from being filled */}
                    <PenIcon />
                  </Button>
                  <Button
                    disabled={isDeleting}
                    onClick={() => handleDelete(id)}
                  >
                    <Trash />
                  </Button>
                </TableHead>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                No categories found. Create one to get started!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default CategoryComponent;
