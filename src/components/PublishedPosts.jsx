import { useQuery } from "@tanstack/react-query";
import React from "react";
import BlogGrid from "./BlogGrid";
import { fetchPosts } from "@/services/post";
import { useSearchParams } from "react-router";
import Loader from "./Loader";
import PaginationComponent from "./PaginationComponent";

// const PublishedPosts = () => {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const currPage = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  
//   const { data, isLoading } = useQuery({
//     queryKey: ["posts", "published", currPage],
//     queryFn: fetchPosts,
//   });

//   if (isLoading) return <Loader/>

//   const blogPosts = data?.content || [];
//   const totalPages = data?.totalPages || 0;


//   function handlePageChange(newPage) {
//     if (newPage >= 1 && newPage <= totalPages) {
//       searchParams.set("page", newPage.toString());
//       setSearchParams(searchParams);
//     }
//   }

//   return (
//     <div className="flex flex-col min-h-screen">
//       {/* Blog Grid takes up available space */}
//       <div className="flex-grow">
//         <BlogGrid blogPosts={blogPosts} years={years} />
//       </div>
      
//       {/* Pagination fixed at bottom */}
//       {/* <div className="sticky bottom-0 bg-background  py-4">
//         <div className="container outline-0 outline-indigo-600 mx-auto px-8">
//           <div className="flex flex-col outline-0 outline-green-800 md:flex-row justify-around items-center gap-4">
//             <div className="text-sm w-full text-center outline-1 outline-amber-800  text-muted-foreground">
//               <span>Page {currPage} of {totalPages}</span>
//             </div>
            
//             {totalPages > 1 && (
//               <Pagination className="mt-0 outline-1 outline-black  w-full">
//                 <PaginationContent>
//                   <PaginationItem>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => handlePageChange(currPage - 1)}
//                       disabled={currPage <= 1}
//                       className="gap-1"
//                     >
//                       <ChevronLeftIcon className="h-4 w-4" />
//                       <span>Previous</span>
//                     </Button>
//                   </PaginationItem>
                  
//                   <PaginationItem>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       disabled={currPage >= totalPages}
//                       onClick={() => handlePageChange(currPage + 1)}
//                       className="gap-1"
//                     >
//                       <span>Next</span>
//                       <ChevronRightIcon className="h-4 w-4" />
//                     </Button>
//                   </PaginationItem>
//                 </PaginationContent>
//               </Pagination>
//             )}
//           </div>
//         </div>
//       </div> */}
//     <PaginationComponent totalPages={totalPages } />
//     </div>
//   );
// };

// export default PublishedPosts;
const PublishedPosts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currPage = searchParams.get("page") ? Number(searchParams.get("page")) : 1;

  const { data, isLoading } = useQuery({
    queryKey: ["posts", "published", currPage],
    queryFn: fetchPosts,
  });

  if (isLoading) return <Loader/>

  const blogPosts = data?.content || [];
  const totalPages = data?.totalPages || 0;

  function handlePageChange(newPage) {
    if (newPage >= 1 && newPage <= totalPages) {
      searchParams.set("page", newPage.toString());
      setSearchParams(searchParams);
    }
  }
  const years = [
    ...new Set(
      data?.content?.map((post) =>
        new Date(post.createdAt)
          .toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
          })
          .slice(0, 16)
      )
    ),
  ].sort().reverse();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <BlogGrid blogPosts={blogPosts} years={years} />
      </div>
      <PaginationComponent
        currPage={currPage}
        totalPages={totalPages}
        onPageChange={handlePageChange} 
      />
    </div>
  );
};

export default PublishedPosts;