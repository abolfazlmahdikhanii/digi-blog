import { useAuth } from "@/context/AuthContext";
import React, { useState } from "react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
const useTopicFollow = (slug, initialData) => {
  const { data:follow, isLoading, refetch } = useQuery({
    queryKey: [`follow-${slug}`],
    queryFn: () =>
      fetch(`/api/topics/${slug}/follow`).then((res) => res.json()),
    enabled: !!slug,
  });
  const { user } = useAuth();
  const [followLoading, setFollowLoading] = useState(false);
  
  const followHandler = async (e) => {
    e.preventDefault();
    try {
      if (!user) {
        toast.warning("You Should Signin!");
        return;
      }
      if (followLoading) return;
      setFollowLoading(true);
      const res = await fetch(`/api/topics/${slug}/follow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to Follow");
      }
      refetch();

      setFollowLoading(false);
    } catch (error) {
      setFollowLoading(false);
      toast.error(error.message);
    }
  };

  return { follow, followHandler,followLoading };
};

export default useTopicFollow;
