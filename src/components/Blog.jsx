import React from "react";
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


const Blog = () => {
  const blogPosts = [
    {
      year: 2024,
      title: "A Retrospective on 14 Nights in Japan",
      description:
        "I planned a 2-week trip to Japan during the summer of 2023 for my family. Here are some of the highlights, blunders, experiences gathered throughout the process.",
      date: "Dec 31, 2024",
      readTime: "93 min read",
      tags: ["miscellaneous", "travel"],
    },
    {
      year: 2023,
      title: "A Hackable Unity Implementation of Project SEKAI's Gacha System",
      description:
        "I created a fully functional, hackable replica of Project SEKAI's gacha system for SEKAICTF 2023. This was my design process.",
      date: "Aug 15, 2023",
      readTime: "25 min read",
      tags: ["unity", "game-hacking", "reverse-engineering"],
    },
    {
      year: 2023,
      title: "Chinese Remainder Theorem, Carnival Games and a 2048-bit Integer",
      description:
        "A journey through number theory, carnival games, and cryptography in AmateursCTF 2023.",
      date: "Jul 24, 2023",
      readTime: "18 min read",
      tags: ["programming", "algorithm"],
    },
  ];

  // Group posts by year for the sidebar
  const years = [...new Set(blogPosts.map((post) => post.year))].sort().reverse();
  return (
    <div className="flex p-4 gap-4 outline-4 outline-amber-200">
      {/* Sidebar for years */}
      <aside className="w-32">
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="flex flex-col space-y-2">
            {years.map((year) => (
              <Button
                key={year}
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
      <div className="flex-1">
        <div className="space-y-4">
          {blogPosts.map((post, index) => (
            <Card key={index} className="flex bg-muted border-none">
              {/* Thumbnail placeholder (you can replace with an image) */}
              {/* <div className="w-48 h-48 bg-gray-700 flex-shrink-0" /> */}
              <div className="flex-1 p-4">
                <CardHeader>
                  <CardTitle className="text-xl">{post.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {post.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    enscribe • {post.date} • {post.readTime}
                  </p>
                  <div className="mt-2 flex space-x-2">
                    {post.tags.map((tag, i) => (
                      <span key={i} className="text-xs text-muted-foreground">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
