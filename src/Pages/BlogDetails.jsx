import { useParams } from "react-router";

import { getPost } from "@/services/post";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react"; // Import useState
import "../App.css";
import { getSanitizedHTML } from "@/lib/utils";
import slugify from "slugify";

const BlogDetails = () => {
  const { id } = useParams();
  const contentRef = useRef(null);
  const [tableOfContents, setTableOfContents] = useState([]); // State to store TOC items

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
      console.log("blog from effect^^^");
      console.log(blog?.content);
    }
  }, [blog]); // Re-run when blog data changes

  if (id === null || id === undefined) {
    return <div>Post doesn't exist</div>;
  }
  if (isLoading) {
    return <div>Blog loading</div>;
  }

  return (
    // <div className="p-4 md:p-16 flex flex-col md:flex-row justify-center gap-8">
    <div className="p-4 grid grid-row-[1fr_2fr_auto] md:grid-cols-[1fr_2fr_1fr] gap-4 justify-center justify-items-center ring-1 ring-blue-500">
      {/* Table of Contents Section */}
      {tableOfContents.length > 0 && (
        // <aside className="w-full md:w-64 flex-shrink-0 ring-1 ring-amber-700">
        <aside className=" w-full  md:w-64 md:justify-self-end ring-1 ring-amber-700">
          <div className="sticky top-4  border p-2 md:p-4 rounded-md bg-background shadow-sm ring-2 ring-amber-100">
            {/* <div className="sticky top-4 p-4 border rounded-md bg-background shadow-sm ring-2 ring-amber-100"> */}
            <h3 className="font-semibold mb-3 text-lg">Table of Contents</h3>
            <nav>
              <ul className="space-y-2">
                {tableOfContents.map((item) => (
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
                ))}
              </ul>
            </nav>
          </div>
        </aside>
      )}

      {/* Blog Content Section */}
      <div
        ref={contentRef}
        className="tiptap p-4 prose min-w-[400px] md:max-w-3xl  ring-1 ring-lime-700"
        dangerouslySetInnerHTML={{ __html: getSanitizedHTML(blog.content) }}
      />
      <div className="ring-1 ring-gray-500 "></div>
    </div>
  );
};

export default BlogDetails;
