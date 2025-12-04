import Image from "next/image";
import { Button } from "@/components/ui/button";

import { useState } from "react";
import HoverProfile from "@/components/hover-profile";
import { useRouter } from "next/router";

import { redirect } from "next/navigation";
import useFollow from "@/hooks/useFollow";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatNumber } from "@/lib/utils";
import FollowItem from "@/components/user-follow-item";

export default function AuthorProfilePage() {
  const { query } = useRouter();
  const username = query["@username"]?.replace("@", "");
  const { follower } = useFollow(username);

  return (
    <div className="mt-12 w-[72%] 2xl:w-[80%] mx-auto">
      <h2 className="text-[42px] font-bold border-b py-5">
        {follower?.follower ? formatNumber(follower.follower?.length) : 0}{" "}
        Follower
      </h2>
      <div className="container mx-auto px-4 mt-3">
        <div className="">
          <div className=" mt-7">
            {follower && !!follower?.follower?.length > 0 ? (
              follower.follower.map((item) => (
                <FollowItem author={item.follower} />
              ))
            ) : (
              <div className="  text-center py-12">
                <p className="text-neutral-200 font-semibold mb-4 ">
                  {" "}
                  You haven't follower any people yet
                </p>
                <p className="text-sm text-muted-foreground ">
                  Writers you follow will appear here. The people you follow
                  will influence what you see on your home page and email
                  digests.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
