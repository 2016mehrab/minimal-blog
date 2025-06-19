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
import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "@/services/post";
import { Link } from "react-router";
import { formatReadTime, getTruncatedPlainText } from "@/lib/utils";

const PublishedPosts = () => {
  // const blogPosts = [
  //   {
  //     year: 2024,
  //     title: "A Retrospective on 14 Nights in Japan",
  //     description:
  //       "I planned a 2-week trip to Japan during the summer of 2023 for my family. Here are some of the highlights, blunders, experiences gathered throughout the process.",
  //     date: "Dec 31, 2024",
  //     readTime: "93 min read",
  //     tags: ["miscellaneous", "travel"],
  //   },
  //   {
  //     year: 2023,
  //     title: "A Hackable Unity Implementation of Project SEKAI's Gacha System",
  //     description:
  //       "I created a fully functional, hackable replica of Project SEKAI's gacha system for SEKAICTF 2023. This was my design process.",
  //     date: "Aug 15, 2023",
  //     readTime: "25 min read",
  //     tags: ["unity", "game-hacking", "reverse-engineering"],
  //   },
  //   {
  //     year: 2023,
  //     title: "Chinese Remainder Theorem, Carnival Games and a 2048-bit Integer",
  //     description:
  //       "A journey through number theory, carnival games, and cryptography in AmateursCTF 2023.",
  //     date: "Jul 24, 2023",
  //     readTime: "18 min read",
  //     tags: ["programming", "algorithm"],
  //   },
  // ];

  const { data: blogPosts, isLoading } = useQuery({
    queryKey: ["posts",'published'],
    queryFn: fetchPosts,
  });
  if (isLoading) return <div>Loading posts.</div>;

  // Group posts by year for the sidebar
  console.log("fetched posts", blogPosts);

  const years = [
    2016, 2017, 2019, 2018, 2018, 2018, 2018, 2018, 2018, 2018, 2018, 2018,
    2018, 2018, 2018, 2018, 2018, 2018, 2018, 2018, 2018, 2018, 2018, 2018,
  ];
  // const years = [...new Set(blogPosts.map((post) => post.createAt))]
  //   .sort()
  //   .reverse();

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
          {blogPosts.map((post) => (
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
                      • {formatReadTime(post.readingTime) }
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

export default PublishedPosts;
