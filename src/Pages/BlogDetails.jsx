import { getPost } from "@/services/post";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import { useParams } from "react-router";
import "../App.css";
import { getSanitizedHTML } from "@/lib/utils";
import hljs from "highlight.js";

const BlogDetails = () => {
  const { id } = useParams();
  const contentRef = useRef(null);
  console.log("post id", id);
  const { data: blog, isLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPost({ postId: id }),
  });

  useEffect(()=>{
    if(blog && contentRef.current){
        contentRef.current.querySelectorAll("pre code").forEach(blk=>{
            hljs.highlightElement(blk);
        })
    }
  },[blog])
  if (id === null || id === undefined) {
    return <div>Post doesn't exist</div>;
  }
  if (isLoading) {
    return <div>Blog loading</div>;
  }
  console.log("Blog", blog);

  return (
    <div className="p-16 flex justify-center">
      <div ref={contentRef} className="tiptap prose max-w-3xl" dangerouslySetInnerHTML={{__html: getSanitizedHTML(blog.content)}} />
    </div>
  );
};

export default BlogDetails;
