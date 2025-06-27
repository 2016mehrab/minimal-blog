import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { XCircle } from "lucide-react";

const FilterSort = ({categoryId, categories, handleCategoryChange,tagId, tags, handleTagChange, sort, handleSortChange, clearFilters}) => {
  return (
    <div className="container mx-auto   py-4">
      <div className="flex flex-col md:flex-row gap-4 justify-end  items-center">
        <Select value={categoryId} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[210px]">
            <SelectValue placeholder="Filter by Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-categories">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={tagId} onValueChange={handleTagChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-tags">All Tags</SelectItem>
            {tags.map((tag) => (
              <SelectItem key={tag.id} value={tag.id}>
                {tag.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt,desc">Newest First</SelectItem>
            <SelectItem value="createdAt,asc">Oldest First</SelectItem>
            <SelectItem value="title,asc">Title (A-Z)</SelectItem>
            <SelectItem value="title,desc">Title (Z-A)</SelectItem>
            <SelectItem value="readingTime,asc">
              Reading Time (Low to High)
            </SelectItem>
            <SelectItem value="readingTime,desc">
              Reading Time (High to Low)
            </SelectItem>
          </SelectContent>
        </Select>


        {(categoryId || tagId) && (
          <Button
            variant="outline"
            onClick={clearFilters}
            className="flex items-center gap-1"
          >
            <XCircle className="h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default FilterSort;
