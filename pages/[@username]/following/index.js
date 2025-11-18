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

export default function Following() {
  const { query } = useRouter();
  const username = query["@username"]?.replace("@", "");
  const { following } = useFollow(username);

  return (
    <div className="mt-12 w-[72%] mx-auto">
      <h2 className="text-[42px] font-bold border-b py-5">
        {following?.following ? formatNumber(following.following?.length) : 0}{" "}
        Following
      </h2>
      <div className="container mx-auto px-4 mt-3">
        <div className="">
          <div className=" mt-7">
            {following && following?.following?.length > 0 ? (
              following.following.map((item) => (
                <FollowItem author={item.following} />
              ))
            ) : (
              <div className="  text-center py-12">
                <p className="text-neutral-200 font-semibold mb-4 "> You haven't followed any people yet</p>
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
