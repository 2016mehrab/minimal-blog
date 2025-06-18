import React from "react";
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import CreateCategoryForm from "./CreateCategoryForm";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/services/category";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import { useDeleteCategory } from "@/hooks/useDeleteCategory";
import { toast } from "sonner";
import EditCategoryForm from "./EditCategoryForm";
import { useUser } from "@/hooks/useUser";
import TableComponent from "./TableComponent";

const CategoryComponent = () => {
  const { user, isLoading: isLoadingUser } = useUser();
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

  const isAdmin = user?.role.some((r) => r === "ROLE_ADMIN") || false;
  if (isLoading || isLoadingUser)
    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Categories</h2>
           {isLoadingUser ? null : isAdmin && <CreateCategoryForm />}
        </div>
        <p>Loading categories...</p>
      </>
    );

  if (isError) {
    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Categories</h2>
           {isLoadingUser ? null : isAdmin && <CreateCategoryForm />}
        </div>
        <p className="text-red-500">
          Error: {error?.message || "Failed to load categories."}
        </p>
      </>
    );
  }

  // const isAdmin = user?.role.some((r) => r === "ROLE_ADMIN") || false;

  function handleDelete(id) {
    deleteCategory(id, {
      onSuccess: () => toast.success("Category deleted"),
      onError: (err) => {
        toast.error(err.message || "Failed to delete category");
      },
    });
  }
  function renderRow(category, index, { isAdmin, handleDelete, isDeleting }) {
    return (
      <TableRow key={category.id}>
        <TableCell className="w-[100px]  text-center">
          {category.name.toUpperCase()}
        </TableCell>
        <TableCell className={"text-center"}>{category.postCount} </TableCell>
        <TableCell className=" flex justify-center items-center  gap-1.5 outline-2 outline-emerald-600">
          {isAdmin ? (
            <>
              <EditCategoryForm
                category={{ id: category.id, name: category.name }}
              />
              <Button
                disabled={isDeleting}
                onClick={() => handleDelete(category.id)}
              >
                <Trash />
              </Button>
            </>
          ) : (
            "-"
          )}
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      <div className="flex justify-between">
        <h2>Categories</h2>
        {isAdmin && <CreateCategoryForm />}
      </div>
      <TableComponent
        data={categories}
        headers={["name", "post count", "actions"]}
        renderRow={renderRow}
        caption="A list of available categories"
        noDataContent="No categories found."
        renderRowProps={{ isAdmin, handleDelete, isDeleting }}
        colSpanForNoData={3}
      />
    </>
  );
};

export default CategoryComponent;
