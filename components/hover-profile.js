import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import FollowBtn from "./FollowBtn";
import Link from "next/link";
import useFollow from "@/hooks/useFollow";
import { formatNumber } from "@/lib/utils";
const HoverProfile = ({ author, size = "sm" }) => {
  const { follower } = useFollow(author?.username);

  return (
    <div
      className={`flex items-center gap-2 ${size !== "lg" ? "mb-5" : "mb-0"}`}
    >
      <Avatar className={`${size !== "lg" ? "h-6 w-6" : "h-10 w-10"}`}>
        <AvatarImage src={author?.profileImage} alt={author?.username} />
        <AvatarFallback
          className={`${size !== "lg" ? "text-[9px]" : "text-sm"}`}
        >
          {author?.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-x-3 ml-0.5">
        <HoverCard>
          <HoverCardTrigger asChild>
            <Link
              href={`/@${author?.username.toLowerCase()}`}
              className="flex items-center gap-3 hover:underline transition-all duration-150"
            >
              <p className="font-semibold text-sm not-prose capitalize">
                {author?.name}
              </p>
            </Link>
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="flex items-center justify-between">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={author?.profileImage}
                  alt={author?.username}
                />
                <AvatarFallback>
                  {author?.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <FollowBtn username={author?.username} />
            </div>
            <div>
              <p className="font-semibold text-lg not-prose capitalize mt-4 mb-1.5">
                {author?.name}
              </p>
              <p className="font-light text-xs not-prose   mb-4">
                {follower?.follower
                  ? formatNumber(follower.follower.length)
                  : 0}{" "}
                follower
              </p>
              <p className="text-xs leading-[1.7] text-neutral-400">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores
                praesentium aperiam sequi ad nesciunt odio expedita nam rem,
                voluptates
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  );
};

export default HoverProfile;
