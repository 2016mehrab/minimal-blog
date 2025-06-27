import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
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
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Loader from "./Loader";
import { ScrollArea } from "./ui/scroll-area";

function renderCategoryRow(
  category,
  index,
  { isAdmin, handleDelete, isDeleting }
) {
  return (
    <TableRow key={category.id}>
      <TableCell className="w-[100px] text-center text-foreground">
        {category.name.toUpperCase()}
      </TableCell>
      <TableCell className={"text-center text-muted-foreground"}>
        {category.postCount}
      </TableCell>
      <TableCell className="flex justify-center items-center gap-1.5">
        {isAdmin ? (
          <>
            <EditCategoryForm
              category={{ id: category.id, name: category.name }}
            />
            <Button
              variant="destructive"
              size="icon"
              disabled={isDeleting}
              onClick={() => handleDelete(category.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </TableCell>
    </TableRow>
  );
}

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

  const isAdmin = user?.role?.some((r) => r === "ROLE_ADMIN") || false;

  function handleDelete(id) {
    deleteCategory(id, {
      onSuccess: () => toast.success("Category deleted"),
      onError: (err) => {
        toast.error(err.message || "Failed to delete category");
      },
    });
  }

  let content;
  if (isLoading || isLoadingUser) {
    content = <Loader />;
  } else if (isError) {
    content = (
      <p className="text-destructive text-center py-4">
        Error: {error?.message || "Failed to load categories."}
      </p>
    );
  } else if (!categories || categories.length === 0) {
    content = (
      <p className="text-muted-foreground text-center py-4">
        No categories found.
      </p>
    );
  } else {
    content = (
      <TableComponent
        data={categories}
        headers={["name", "post count", "actions"]}
        renderRow={renderCategoryRow}
        caption="A list of available categories"
        noDataContent="No categories found."
        renderRowProps={{ isAdmin, handleDelete, isDeleting }}
        colSpanForNoData={3}
      />
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold text-foreground">
            Categories
          </CardTitle>
          <CardAction>{isAdmin && <CreateCategoryForm />}</CardAction>
        </CardHeader>
        <ScrollArea className={"h-screen"}>

        <CardContent>{content}</CardContent>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default CategoryComponent;
