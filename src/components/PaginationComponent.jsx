import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Button } from "./ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const PaginationComponent = ({ currPage, totalPages, onPageChange }) => {
  return (
    <div className="sticky bottom-0 bg-background py-4">
      <div className="container mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-around items-center gap-4">
          <div className="text-sm w-full text-center text-muted-foreground">
            <span>
              Page {currPage} of {totalPages}
            </span>
          </div>

          {totalPages > 1 && (
            <Pagination className="mt-0 w-full">
              <PaginationContent>
                <PaginationItem>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currPage - 1)} 
                    disabled={currPage <= 1}
                    className="gap-1"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                    <span>Previous</span>
                  </Button>
                </PaginationItem>

                <PaginationItem>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currPage >= totalPages}
                    onClick={() => onPageChange(currPage + 1)} 
                    className="gap-1"
                  >
                    <span>Next</span>
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaginationComponent;