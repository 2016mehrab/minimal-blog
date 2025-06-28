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
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { GithubIcon, GlobeIcon, LinkedinIcon } from "lucide-react";

function getStatusBadge(status) {
  switch (status) {
    case "PUBLISHED":
      return {
        text: "Published",
        className: "bg-chart-1 text-primary-foreground",
      };
    case "DRAFT":
      return {
        text: "Draft",
        className: "bg-chart-4 text-secondary-foreground",
      };
    case "PENDING":
      return {
        text: "Pending",
        className: "bg-chart-3 text-accent-foreground",
      };
    default:
      return null;
  }
}

const BlogGrid = ({ blogPosts, years, badge = false, authority = false }) => {
  console.log("fetched posts", blogPosts);

  const hasAuthority = authority;

  return (
    <div className="min-h-screen grid grid-cols-[1fr] md:grid-cols-[1fr_2fr_1fr] p-4 gap-4 ">
      <aside className="hidden md:grid grid-cols-[1fr_2fr] justify-items-center  ">
        <div className=""></div>
        <div className="flex flex-col  space-y-4 w-full ">
          {" "}
          <Card className="shadow-md rounded-lg p-4 bg-card text-card-foreground  ">
            <CardHeader className="p-0 pb-3 flex flex-col items-center">
              <Avatar className="h-20 w-20 mb-3">
                <AvatarImage
                  className={"object-cover object-top"}
                  src="/Mehrab_Hasan_Eshan.JPG"
                  alt="Author Avatar"
                />
                <AvatarFallback>Eshan</AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl font-bold text-center">
                About the Developer
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 text-sm text-muted-foreground text-center">
              <p className="mb-2">
                Hello! I'm Eshan, the developer behind this blog. This project
                showcases my skills in modern web development.
              </p>
              <p>
                I specialize in building engaging and robust user interfaces.
              </p>
            </CardContent>
            <CardFooter className="p-0 pt-4 flex justify-center gap-4">
              <Link
                to="https://github.com/2016mehrab"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <GithubIcon className="!size-6" />
                <span className="sr-only">GitHub Profile</span>
              </Link>
              <Link
                to="https://www.linkedin.com/in/2016mehrab"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <LinkedinIcon className="!size-6" />
                <span className="sr-only">LinkedIn Profile</span>
              </Link>
              {/* <Link
                to="https://portfolio.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <GlobeIcon className="h-6 w-6" />
                <span className="sr-only">Personal Website</span>
              </Link> */}
            </CardFooter>
          </Card>
          <Card className=" shadow-md rounded-lg p-4 bg-card text-card-foreground">
            <CardHeader className="p-0 pb-2">
              <CardTitle className="text-xl font-bold">
                Minimal-Blog Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 text-sm text-muted-foreground">
              <p>
                This blog aims to offer a simple and efficient platform for authors to write and manage their posts. It ensures that authors can create content easily, editors can review and publish it smoothly and admins can manage accounts and oversee the entire process. The goal is to make the blogging experience straightforward and secure for everyone. 
              </p>
            </CardContent>
          </Card>
        </div>
      </aside>

      <div className="w-full min-w-64  max-w-2xl mx-auto">
        <div className="space-y-4 ">
          {blogPosts?.map((post) => {
            const status =
              badge && post.status ? getStatusBadge(post.status) : null;
            return (
              <Card key={post.id} className="flex py-0 border-none ">
                <Link to={`/posts/${post.id}`} className="py-6 ">
                  <div className="space-y-3">
                    <CardHeader>
                      <div className="flex flex-wrap items-center gap-2">
                        <CardTitle className="text-xl text-ellipsis">
                          {post.title}
                        </CardTitle>
                        {badge && status && (
                          <Badge className={status.className}>
                            {status.text}
                          </Badge>
                        )}
                        {post.category && (
                          <Badge
                            variant="outline"
                            className="text-muted-foreground border-muted-foreground/50"
                          >
                            {post.category.name}
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-muted-foreground break-words overflow-hidden">
                        {getTruncatedPlainText(post.content, 200)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground font-semibold">
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
                      <div className="w-full flex flex-col space-y-2 md:space-y-0 md:flex-row  md:justify-between  md:items-center ">
                        <div className="flex space-x-2">
                          {post.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="text-xs text-muted-foreground hover:bg-muted-foreground hover:text-background"
                            >
                              #{tag.name}
                            </span>
                          ))}
                        </div>
                        {hasAuthority && (
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
      <div className=""></div>
    </div>
  );
};

export default BlogGrid;
