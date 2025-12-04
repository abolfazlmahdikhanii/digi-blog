import { useAuth } from "@/context/AuthContext";
import React, { useState } from "react";
import { toast } from "sonner";
import { useQueries } from "@tanstack/react-query";
const useFollow = (username, initialData) => {
  const queries = useQueries({
    queries: [
      {
        queryKey: [`follow-${username}`],
        queryFn: () =>
          fetch(`/api/user/${username}/follow`).then((res) => res.json()),
        enabled: !!username,
      },
      {
        queryKey: [`following-${username}`],
        queryFn: () =>
          fetch(`/api/user/${username}/following`).then((res) => res.json()),
        enabled: !!username,
        initialData: initialData?.followingData,
      },
      {
        queryKey: [`follower-${username}`],
        queryFn: () =>
          fetch(`/api/user/${username}/follower`).then((res) => res.json()),
        enabled: !!username,
        initialData: initialData?.followerData,
      },
    ],
  });
  const { user } = useAuth();
  const [followQuery, followingQuery, followerQuery] = queries;
  const follow = followQuery.data;
  const refetchFollow = followQuery.refetch;
  const [followLoading, setFollowLoading] = useState(false);

  const following = followingQuery.data;
  const follower = followerQuery.data;
  const refetchFollower = followerQuery.refetch;

  const followHandler = async (e) => {
    e.preventDefault();
    try {
      if (!user) {
        toast.warning("You Should Signin!");
        return;
      }
      if (followLoading) return;
      setFollowLoading(true);
      const res = await fetch(`/api/user/${username}/follow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to Follow");
      }
      refetchFollow();
      refetchFollower();
      setFollowLoading(false);
    } catch (error) {
      setFollowLoading(false);
      toast.error(error.message);
    }
  };

  return { follow, followLoading, following, follower, followHandler };
};

export default useFollow;
