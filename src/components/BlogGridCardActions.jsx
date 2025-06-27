import { useBlogStatus } from "@/hooks/useBlogStatus";
import React from "react";
import { Button } from "./ui/button";
import { CheckCircle2Icon, CircleSlash2Icon } from "lucide-react";

const BlogGridCardActions= ({ postId }) => {
  const { mutate: approve, isPending: isApproving } = useBlogStatus("approve");
  const { mutate: reject, isPending: isRejecting } = useBlogStatus("reject");

  return (
    <div className="flex w-full md:w-auto justify-end  gap-2 md:gap-4">
      <Button
        onClick={(e) => {
          e.preventDefault();
          approve(postId);
        }}
        type="button"
        disabled={isApproving}
        variant="outline"
        size="sm"
      >
        {isApproving ? "Approving" : <CheckCircle2Icon className="!size-4" />}
      </Button>
      <Button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          reject(postId);
        }}
        disabled={isRejecting}
        variant="destructive"
        size="sm"
      >
        {isRejecting ? "Rejecting" : <CircleSlash2Icon className="!size-4" />}
      </Button>
    </div>
  );
};

export default BlogGridCardActions ;
