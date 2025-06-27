import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router";
import { formatReadTime, getTruncatedPlainText } from "@/lib/utils";
import { Badge } from "./ui/badge";
import BlogGridCardActions from "./BlogGridCardActions";

function getStatusBadge(status) {
  switch (status) {
    // TODO: fix palette
    case "PUBLISHED":
      return { text: "Published", variant: "default" };
    case "DRAFT":
      return { text: "Draft", variant: "outline" };
    case "PENDING":
      return { text: "Pending", variant: "destructive" };
    default:
      return null;
  }
}
const BlogGrid = ({ blogPosts, years, badge = false, authority = false }) => {
  console.log("fetched posts", blogPosts);

  const hasAuthority = authority;

  return (
    // <div className="flex p-4 gap-4 outline-4 outline-amber-200">
    <div className="grid grid-cols-[1fr_2fr_1fr] p-4 gap-4 outline-4 outline-amber-200">
      {/* Sidebar for years */}
      {/* <aside className="w-32"> */}
      <aside className="grid grid-cols-[1fr_2fr] justify-items-center  ring-1 ring-amber-900">
        <div className="ring-1 ring-green-600"></div>
        <ScrollArea className="h-[calc(100vh-8rem)] ring-1 ring-yellow-600">
          {/* <ScrollArea className="h-[calc(100vh-8rem)] "> */}
          <div className="flex flex-col space-y-2">
            {years.map((year, idx) => (
              <Button
                key={idx}
                variant="ghost"
                className="justify-start text-muted-foreground hover:text-foreground"
              >
                {year}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </aside>

      {/* Main content area */}
      <div className="w-full min-w-64  max-w-2xl mx-auto">
        <div className="space-y-4 ">
          {blogPosts?.map((post) => {
            const status =
              badge && post.status ? getStatusBadge(post.status) : null;
            return (
              <Card
                key={post.id}
                className="flex py-0 bg-muted border-none ring-2 ring-amber-500"
              >
                <Link
                  to={`/posts/${post.id}`}
                  className="py-6 ring-2 ring-red-300"
                >
                  {/* Thumbnail placeholder (you can replace with an image) */}
                  {/* <div className="w-48 h-48 bg-gray-700 flex-shrink-0" /> */}
                  <div className="space-y-3">
                    <CardHeader>
                      <div className="flex flex-wrap items-center gap-2">
                        <CardTitle className="text-xl text-ellipsis">{post.title}</CardTitle>
                        {badge && (
                          <Badge variant={status.variant}>{status.text}</Badge>
                        )}
                      </div>
                      <CardDescription className="text-muted-foreground break-words overflow-hidden">
                        {getTruncatedPlainText(post.content, 200)}
                        {/* {post.content} */}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground ">
                        {post.author.name} •{" "}
                        {new Date(post.createdAt).toLocaleDateString("en-Us", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}{" "}
                        • {formatReadTime(post.readingTime)}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <div className="w-full flex flex-col space-y-2 md:space-y-0 md:flex-row  md:justify-between  md:items-center outline-3 outline-blue-300">
                        <div className="flex space-x-2">
                          {post.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="text-xs text-muted-foreground hover:bg-muted-foreground hover:text-white"
                            >
                              #{tag.name}
                            </span>
                          ))}
                        </div>
                        {hasAuthority &&  (
                          <BlogGridCardActions postId={post.id} />
                        )}
                      </div>
                    </CardFooter>
                  </div>
                </Link>
              </Card>
            );
          })}
        </div>
      </div>
      <div className="ring-1 ring-red-500"></div>
    </div>
  );
};

export default BlogGrid;
