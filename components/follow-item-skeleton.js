import { Skeleton } from "./ui/skeleton";

const FollowItemSkeleton = () => {
  return (
    <div className="flex items-center justify-between w-full mb-4">
      <div className="flex items-center gap-4.5">
        {/* Avatar Skeleton */}
        <Skeleton className="w-16 h-16 rounded-full" />

        {/* Content Skeleton */}
        <div className="space-y-2">
          {/* Name Skeleton */}
          <Skeleton className="h-5 w-32" />
          {/* Bio Skeleton */}
          <Skeleton className="h-4 w-48" />
        </div>
      </div>

      {/* Button Skeleton */}
      <Skeleton className="h-9 w-20 rounded-md" />
    </div>
  );
};
export default FollowItemSkeleton;
