"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import FollowBtn from "./FollowBtn";

export function WhoToFollowCard({ _id, name, bio, profileImage, username }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 border rounded-lg text-center h-full">
      <Link href={`/@${username}`}>
        <Avatar className="h-16 w-16 mb-4">
          <AvatarImage src={profileImage} alt={name} />
          <AvatarFallback className={"capitalize text-lg"}>
            {name.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </Link>
      <h3 className="font-bold text-lg line-clamp-1 capitalize">{name}</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-4 line-clamp-2 h-[50px] ">
        {bio}
      </p>
      <div className="w-full">
        <FollowBtn username={username} isFollowPage isFullWidth />
      </div>
    </div>
  );
}
