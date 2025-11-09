import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FollowBtn from "./FollowBtn";
const FollowItem = ({ author }) => {
  return (
    <>
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4.5 mb-4">
          <Avatar className="w-16 h-16 self-start">
            <AvatarImage src={author?.profileImage} alt={author?.name} />
            <AvatarFallback className={"capitalize text-lg"}>
              {author?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-headline  font-bold tracking-tight capitalize">
              {author?.name}
            </h1>
            {author.bio ? (
              <p className=" text-muted-foreground/80 text-sm mt-1.5">
                {author.bio}
              </p>
            ) : null}
          </div>
        </div>
        <FollowBtn username={author.username} isFollowPage/>
      </div>
    </>
  );
};

export default FollowItem;
