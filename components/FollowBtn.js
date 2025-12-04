import useFollow from "@/hooks/useFollow";
import React from "react";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { useAuth } from "@/context/AuthContext";

const FollowBtn = ({ username, isFollowPage = false, isFullWidth = false }) => {
  const { user } = useAuth();
  const { followHandler, followLoading, follow } = useFollow(username);
  return (
    <Button
      variant={follow?.isFollow ? "outline" : "secondary"}
      className={`capitalize rounded-full h-10 ${
        !isFollowPage ? " self-end" : ""
      } ${isFullWidth ? "w-full" : ""} ${
        user && user.username === username ? "hidden" : ""
      }`}
      onClick={followHandler}
      disabled={followLoading}
    >
      {follow?.isFollow ? "Following" : "Follow"} {followLoading && <Spinner />}
    </Button>
  );
};

export default FollowBtn;
