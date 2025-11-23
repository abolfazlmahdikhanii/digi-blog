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
            ? "flex-row gap-3 sm:gap-6 md:gap-8"
            : "flex-col-reverse gap-4 sm:gap-6 md:gap-7"
        }`}
      >
        {/* Content Section */}
        <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
          {/* Author Info with Avatar and Name */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 sm:h-6 sm:w-6 rounded-full flex-shrink-0" />
            <Skeleton className="h-3 w-20 sm:h-4 sm:w-32" />
            <Skeleton className="h-2.5 w-14 sm:h-3 sm:w-20" />
          </div>

          {/* Title */}
          <div className="space-y-1.5 sm:space-y-2">
            <Skeleton className="h-5 sm:h-6 w-full" />
            <Skeleton className="h-5 sm:h-6 w-4/5 sm:w-3/4" />
          </div>

          {/* Short Description - Hidden on mobile for non-col layout */}
          <div className={`space-y-1.5 sm:space-y-2 mt-1.5 sm:mt-2 ${!isCol ? "hidden sm:block" : ""}`}>
            <Skeleton className="h-3.5 sm:h-4 w-full" />
            <Skeleton className="h-3.5 sm:h-4 w-full" />
            <Skeleton className="h-3.5 sm:h-4 w-2/3" />
          </div>

          {/* Footer with stats and actions */}
          <div
            className={`flex items-center justify-between ${
              !isCol ? "pt-2 sm:pt-3 md:pt-4" : "pt-2 sm:pt-3"
            }`}
          >
            <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
              <Skeleton className="h-2.5 sm:h-3 w-12 sm:w-16" />
              <Skeleton className="h-2.5 sm:h-3 w-10 sm:w-12" />
              <Skeleton className="h-2.5 sm:h-3 w-10 sm:w-12 hidden xs:block" />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton className="h-7 w-7 sm:h-8 sm:w-8 rounded flex-shrink-0" />
              <Skeleton className="h-4 w-4 sm:h-5 sm:w-5 rounded flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div 
          className={`flex-shrink-0 ${
            !isCol 
              ? "w-20 sm:w-28 md:w-32 lg:w-1/4" 
              : "w-full"
          }`}
        >
          <Skeleton
            className={`${
              !isCol
                ? "w-full aspect-[4/3] h-16 sm:h-20 md:h-24 lg:h-[150px] lg:max-w-[200px]"
                : "w-full h-48 sm:h-64 md:h-80 lg:h-[380px]"
            } rounded-md`}
          />
        </div>
      </div>
    </div>
  );
};
