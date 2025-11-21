"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import topicModel from "@/models/topics";
import connectToDB from "@/configs/db";
import { verifyRefreshToken, verifyToken } from "@/lib/utils";
import usersModel from "@/models/users";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const MediumLogo = () => (
  <span className="font-serif text-3xl font-medium tracking-tight">Medium</span>
);

export default function TopicSelectionPage({ topics, userInfo }) {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["topic"],
    queryFn: () => fetch("/api/topics").then((res) => res.json()),
    initialData: topics,
  });
  const [selectedTopics, setSelectedTopics] = useState([]);
  const router = useRouter();

  const toggleTopic = (topic) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleUpdateInterest = async (e) => {
    e.preventDefault();
    if (selectedTopics.length < 3) {
      toast.error("Choose three or more topics !");
      return;
    }
    try {
      const res = await fetch(`/api/auth/${user ? user._id : userInfo._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topics: selectedTopics }),
      });
      if (!res.ok) throw new Error("Failed Select Topic!");

      router.replace("/");
    } catch (error) {
      console.log(error);
      toast.error("Failed Update!");
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col items-center">
      <header className="p-4 flex justify-center py-4">
        <MediumLogo />
      </header>
      <main className="flex mt-24 items-center justify-center">
        <div className="text-center max-w-lg w-full">
          <h1 className="text-4xl  mb-8">What are you interested in?</h1>
          <p className="text-muted-foreground mb-12">Choose three or more.</p>
          <div className="flex flex-wrap justify-center gap-3.5 mb-8">
            {data &&
              data?.data?.map((topic) => {
                const isSelected = selectedTopics.includes(topic);
                return (
                  <Button
                    key={topic._id}
                    variant={isSelected ? "secondary" : "outline"}
                    onClick={() => toggleTopic(topic)}
                    className={`flex items-center gap-1.5 px-6 py-2.5 rounded-full text-sm transition-colors capitalize font-semibold`}
                  >
                    {topic.name} <Plus className="h-4 w-4" />
                  </Button>
                );
              })}
          </div>
          <Button
            onClick={handleUpdateInterest}
            className="w-full max-w-xs rounded-full mt-12 min-h-10.5  disabled:opacity-50"
            disabled={selectedTopics.length < 3}
          >
            Continue
          </Button>
        </div>
      </main>
    </div>
  );
}
export async function getServerSideProps(context) {
  const { token,refreshToken } = context.req.cookies;
  await connectToDB();

  // No token - redirect to home/login
  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // Invalid token - redirect to home/login
  const validToken = verifyToken(token);
  const validRefreshToken = verifyRefreshToken(refreshToken);
  if (!validToken && !validRefreshToken) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // Fetch topics
  const topics = await topicModel.find({});
  if (!topics.length) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // User not found - redirect to home/login
  const user = await usersModel.findOne({ email: validToken.email||validRefreshToken.email });
  if (!user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // Check if user has completed name step
  const hasCompletedName = user.name;

  // If name not completed, redirect to name page first
  if (!hasCompletedName) {
    return {
      redirect: {
        destination: "/get-started",
        permanent: false,
      },
    };
  }

  // If profile already complete, redirect to home
  if (user.isProfileComplete) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // If topics already selected (at least 3), redirect to home
  if (user.interests?.length >= 3) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // Stay on topics selection page
  return {
    props: {
      userInfo: JSON.parse(JSON.stringify(user)),
      topics: JSON.parse(JSON.stringify(topics)),
    },
  };
}
