import React from "react";
import { Button } from "./ui/button";
import useTopicFollow from "@/hooks/useTopicFollow";
import { Spinner } from "./ui/spinner";

const FollowTopicBtn = ({ slug }) => {
  const { followHandler, followLoading, follow } = useTopicFollow(slug);
  return (
    <Button
      variant={follow?.isFollow?"outline":"secondary"}
      className={`capitalize rounded-full h-10  `}
      onClick={followHandler}
      disabled={followLoading}
    >
      {follow?.isFollow ? "Following" : "Follow"} {followLoading && <Spinner />}
    </Button>
  );
};

export default FollowTopicBtn;
