import { getTruncatedPlainText } from "@/lib/utils";
import { fetchDrafts } from "@/services/post";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router";

const DraftedPosts = () => {
  const { data: blogPosts, isLoading } = useQuery({
    queryKey: ["posts", "draft"],
    queryFn: fetchDrafts,
  });
  if (isLoading) {
    return <div>Loading drafts</div>;
  }
  const years = [
    ...new Set(
      blogPosts.map((post) => new Date(post.createdAt).toUTCString().slice(0,16))
    ),
  ]
    .sort()
    .reverse();

  return (
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
      <div className="w-full min-w-64 overflow-hidden max-w-2xl mx-auto">
        <div className="space-y-4 ">
          {blogPosts.map((post) => (
            <Card
              key={post.id}
              className="flex py-0 bg-muted border-none ring-2 ring-amber-500"
            >
              <Link
                to={`/edit-post/${post.id}`}
                className="py-6 ring-2 ring-red-300"
              >
                {/* Thumbnail placeholder (you can replace with an image) */}
                {/* <div className="w-48 h-48 bg-gray-700 flex-shrink-0" /> */}
                <div className="space-y-3">
                  <CardHeader>
                    <CardTitle className="text-xl">{post.title}</CardTitle>
                    <CardDescription className="text-muted-foreground">
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
                      • {post.readingTime}
                    </p>
                  </CardContent>
                  <CardFooter>
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
                  </CardFooter>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </div>
      <div className="ring-1 ring-red-500"></div>
    </div>
  );
};

export default DraftedPosts;
