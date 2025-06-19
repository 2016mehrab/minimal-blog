import { Link, useNavigate, useParams } from "react-router";

import { getPost } from "@/services/post";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react"; // Import useState
import "../App.css";
import { formatReadTime, getSanitizedHTML } from "@/lib/utils";
import slugify from "slugify";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PencilIcon, TrashIcon } from "lucide-react";
import { useDeletePost } from "@/hooks/useDeletePost";
import { toast } from "sonner";
import { useUser } from "@/hooks/useUser";

const BlogDetails = () => {
  const { id } = useParams();
  const contentRef = useRef(null);
  const [tableOfContents, setTableOfContents] = useState([]); // State to store TOC items
  const { deleteBlog, isLoading: isDeleting } = useDeletePost();
  const { user, isLoading: isLoadingUser } = useUser();
  const navigate = useNavigate();

  const { data: blog, isLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPost({ postId: id }),
  });

  useEffect(() => {
    if (blog && contentRef.current) {
      const headings = contentRef.current.querySelectorAll("h1, h2, h3");
      const toc = [];
      const usedIds = new Set(); // To ensure unique IDs

      headings.forEach((heading) => {
        let id = heading.id || slugify(heading.textContent);

        // Ensure ID is unique
        let counter = 1;
        let originalId = id;
        while (usedIds.has(id)) {
          id = `${originalId}-${counter}`;
          counter++;
        }
        usedIds.add(id);

        heading.id = id; // Assign the ID back to the DOM element

        toc.push({
          id: id,
          text: heading.textContent,
          level: parseInt(heading.tagName.substring(1)), // h1 -> 1, h2 -> 2, etc.
        });
      });

      setTableOfContents(toc); // Update state with TOC
    }
  }, [blog]); // Re-run when blog data changes

  if (id === null || id === undefined) {
    return <div>Post doesn't exist</div>;
  }
  if (isLoading || isLoadingUser) {
    return <div>Blog loading</div>;
  }
  function isAuthor() {
    return blog?.author.id === user.userId;
  }

  function handleDelete() {
    deleteBlog(id, {
      onSuccess: () => {
        toast.success("Blog deleted successfully");
        navigate("/");
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });
  }

  return (
    // <div className="p-4 md:p-16 flex flex-col md:flex-row justify-center gap-8">
    <div className="p-4 grid grid-row-[1fr_2fr_auto] md:grid-cols-[1fr_2fr_1fr] gap-4 justify-center justify-items-center ring-1 ring-blue-500">
      {/* Table of Contents Section */}
      {/* // <aside className="w-full md:w-64 flex-shrink-0 ring-1 ring-amber-700"> */}
      <aside className=" w-full  md:w-64 md:justify-self-end ring-1 ring-amber-700">
        <div className="sticky top-4  border p-2 md:p-4 rounded-md bg-background shadow-sm ring-2 ring-amber-100">
          {/* <div className="sticky top-4 p-4 border rounded-md bg-background shadow-sm ring-2 ring-amber-100"> */}
          <h3 className="font-semibold mb-3 text-lg">Table of Contents</h3>
          <nav>
            <ul className="space-y-2">
              {tableOfContents.length > 0 ? (
                tableOfContents?.map((item) => (
                  <li
                    key={item.id}
                    className={`text-sm ${
                      item.level > 1 ? `ml-${(item.level - 1) * 4}` : ""
                    }`}
                  >
                    <a
                      href={`#${item.id}`}
                      className="scroll-smooth text-muted-foreground hover:text-primary transition-colors block"
                    >
                      {item.text}
                    </a>
                  </li>
                ))
              ) : (
                <li>No table of contents available</li>
              )}
            </ul>
          </nav>
        </div>
      </aside>

      <div className="space-y-4">
        <div>
          <Card className={" rounded-none"}>
            <CardHeader
              className={
                "flex flex-row items-center justify-between space-y-0 pb-2"
              }
            >
              <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                {blog.title}
              </h1>
              {isAuthor() && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/edit-post/${id}`}>
                      <PencilIcon className=" h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    variant="destructive"
                    size="sm"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <CardDescription className="flex flex-col gap-2 text-sm text-muted-foreground">
                <span>By {blog?.author?.name}</span>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span>
                    Published on{" "}
                    {new Date(blog?.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <div className="h-4 w-px bg-muted-foreground/50 mx-1" />
                  <span>{formatReadTime(blog?.readingTime)} read</span>
                </div>
              </CardDescription>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-2 pt-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  Category:
                </span>
                <Badge variant="secondary" className="text-sm">
                  {blog?.category.name}
                </Badge>
              </div>
              {blog?.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((t) => (
                    <Badge key={t.id} variant="outline" className="text-xs">
                      #{t.name}
                    </Badge>
                  ))}
                </div>
              )}
            </CardFooter>
          </Card>
        </div>

        <div
          ref={contentRef}
          className="tiptap p-4 prose min-w-[400px] md:max-w-3xl  ring-1 ring-lime-700"
          dangerouslySetInnerHTML={{ __html: getSanitizedHTML(blog.content) }}
        />
      </div>
      <div className="ring-1 ring-gray-500 "></div>
    </div>
  );
};

export default BlogDetails;
