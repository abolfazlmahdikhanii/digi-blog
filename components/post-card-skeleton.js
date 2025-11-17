import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const PostsListSkeleton = ({ count = 4, isCol = false }) => {
  return (
    <div className="space-y-0">
      {Array.from({ length: count }).map((_, index) => (
        <PostCardSkeleton key={index} isCol={isCol} />
      ))}
    </div>
  );
};
export default PostsListSkeleton;
const PostCardSkeleton = ({ isCol = false }) => {
  return (
    <div className={`flex flex-col py-4 ${!isCol ? "border-b" : ""}`}>
      <div
        className={`flex ${
          !isCol
            ? "flex-row-reverse sm:flex-row gap-8"
            : "flex-col-reverse gap-7"
        }`}
      >
        {/* Content Section */}
        <div className="flex-1 space-y-3">
          {/* Author Info with Avatar and Name */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>

          {/* Short Description */}
          <div className="space-y-2 mt-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Footer with stats and actions */}
          <div
            className={`flex items-center justify-between ${
              !isCol ? "pt-4" : "pt-3"
            }`}
          >
            <div className="flex items-center gap-5">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-12" />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-5 w-5 rounded" />
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className={`${!isCol ? "sm:w-1/4" : "sm:w-full"} flex-shrink-0`}>
          <Skeleton
            className={`${
              !isCol
                ? "max-w-[200px] aspect-[4/3] h-[150px]"
                : "w-full h-[380px]"
            } rounded-md`}
          />
        </div>
      </div>
    </div>
  );
};
