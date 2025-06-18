import React from "react";
import { TableCell, TableRow } from "./ui/table";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import TableComponent from "./TableComponent";
import CreateCategoryForm from "./CreateCategoryForm";
import EditCategoryForm from "./EditCategoryForm";
import { useQuery } from "@tanstack/react-query";
import { fetchTags } from "@/services/tag";
import { useUser } from "@/hooks/useUser";
import CreateTagForm from "./CreateTagForm";
import { useDeleteTag } from "@/hooks/useDeleteTag";
import { toast } from "sonner";
import EditTagForm from "./EditTagForm";

const TagComponent = () => {
  const {deleteTag, isLoading:isDeleting} =useDeleteTag();
  const { user, isLoading: isLoadingUser } = useUser();
  const { data: tags = [], isLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
  });

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

  function handleDelete(id) {
    console.log("Deleted tag with id:", id);
    deleteTag(id,{
      onSuccess: () => toast.success("Tag deleted"),
      onError: (err) => {
        toast.error(err.message || "Failed to delete tag");
      },
    })
  }

  function renderRow(tag, index, { isAdmin, handleDelete, isDeleting }) {
    return (
      <TableRow key={tag.id}>
        <TableCell className={"w-[100px] text-center"}>
          {tag.name.toLowerCase()}
        </TableCell>
        <TableCell className={"text-center"}>{tag.postCount} </TableCell>
        <TableCell className=" flex justify-center items-center  gap-1.5 outline-2 outline-emerald-600">
          {isAdmin ? (
            <>
              <EditTagForm tag={{ id: tag.id, name: tag.name }} />
              <Button
                disabled={isDeleting}
                onClick={() => handleDelete(tag.id)}
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
        <h2>Tags</h2>
        {isAdmin && <CreateTagForm/>}
      </div>
      <TableComponent
        data={tags}
        headers={["name", "post count", "actions"]}
        renderRow={renderRow}
        caption="A list of available tags"
        noDataContent="No tags found."
        renderRowProps={{ isAdmin, handleDelete, isDeleting }}
        colSpanForNoData={3}
      />
    </>
  );
};

export default TagComponent;
