import React from "react";
import { TableCell, TableRow } from "./ui/table";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import TableComponent from "./TableComponent";
import CreateCategoryForm from "./CreateCategoryForm";
import { useQuery } from "@tanstack/react-query";
import { fetchTags } from "@/services/tag";
import { useUser } from "@/hooks/useUser";
import CreateTagForm from "./CreateTagForm";
import { useDeleteTag } from "@/hooks/useDeleteTag";
import { toast } from "sonner";
import EditTagForm from "./EditTagForm";
import Loader from "./Loader";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";

const TagComponent = () => {
  const { deleteTag, isLoading: isDeleting } = useDeleteTag();
  const { user, isLoading: isLoadingUser } = useUser();
  const { data: tags = [], isLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
  });

  const isAdmin = user?.role.some((r) => r === "ROLE_ADMIN") || false;
  // const isAdmin = user?.role.some((r) => r === "ROLE_ADMIN") || true;

  if (isLoading || isLoadingUser)
    return (
      <>
        <Loader />
      </>
    );

  function handleDelete(id) {
    console.log("Deleted tag with id:", id);
    deleteTag(id, {
      onSuccess: () => toast.success("Tag deleted"),
      onError: (err) => {
        toast.error(err.message || "Failed to delete tag");
      },
    });
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
    <div className="container py-8 px-4 min-h-screen mx-auto">
      <Card className={"outline-1 outline-blue-600"}>
        <CardHeader
          className={
            "flex flex-row items-center justify-between space-y-0 pb-4"
          }
        >
          <CardTitle className={"text-2xl font-bold text-foreground"}>
            Tags
          </CardTitle>
          <CardAction>{isAdmin && <CreateTagForm />}</CardAction>
        </CardHeader>
        <CardContent>
          <ScrollArea className={"h-screen outline-1 outline-amber-800"}>
            <TableComponent
              data={tags}
              headers={["name", "post count", "actions"]}
              renderRow={renderRow}
              caption="A list of available tags"
              noDataContent="No tags found."
              renderRowProps={{ isAdmin, handleDelete, isDeleting }}
              colSpanForNoData={3}
            />
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default TagComponent;
