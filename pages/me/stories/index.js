"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  relativeTimeFormat,
  verifyRefreshToken,
  verifyToken,
} from "@/lib/utils";
import { MoreHorizontal, Link as LinkIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import StoryItem from "@/components/story-item";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { toast } from "sonner";
import connectToDB from "@/configs/db";
import usersModel from "@/models/users";

export default function StoriesPage() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["user-post"],
    queryFn: () => fetch("/api/user/post").then((res) => res.json()),
  });
  const [isDelete, setIsDelete] = useState(false);
  const [removeId, setRemoveId] = useState(null);

  const drafts = (data?.posts || []).filter((p) => p.status === "draft");
  const publishes = (data?.posts || []).filter((p) => p.status === "published");

  const removePostHandler = async (id) => {
    try {
      const res = await fetch(`/api/user/post/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to remove post");
      }

      toast.success("Post removed successfully :)");
      setIsDelete(false);
      refetch();
    } catch (error) {
      toast.error("Failed to create post");
    }
  };
  return (
    <div className="container mx-auto px-4 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold font-headline">Stories</h1>
      </div>

      <Tabs defaultValue="drafts">
        <TabsList className="bg-transparent p-0 border-b w-full justify-start rounded-none gap-x-5 ">
          <TabsTrigger
            value="drafts"
            className="rounded-none border-0 flex-0 text-sm transition-all
  text-muted-foreground hover:text-foreground
  data-[state=active]:shadow-none 
  data-[state=active]:border-b-2 
  data-[state=active]:!border-b-foreground 
  data-[state=active]:text-foreground
  data-[state=active]:bg-transparent"
          >
            Drafts{" "}
            {drafts.length > 0 && (
              <span className="ml-2 bg-muted-foreground/20 text-muted-foreground rounded-full px-2 py-0.5 text-xs">
                {drafts?.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="published"
            className="rounded-none border-0 flex-0 text-sm transition-all
  text-muted-foreground hover:text-foreground
  data-[state=active]:shadow-none 
  data-[state=active]:border-b-2 
  data-[state=active]:!border-b-foreground 
  data-[state=active]:text-foreground
  data-[state=active]:bg-transparent"
          >
            Published{" "}
            {publishes.length > 0 && (
              <span className="ml-1.5 bg-muted-foreground/20 text-muted-foreground rounded-full px-2 py-0.5 text-xs">
                {publishes?.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="unlisted"
            className="rounded-none border-0 flex-0 text-sm transition-all
  text-muted-foreground hover:text-foreground
  data-[state=active]:shadow-none 
  data-[state=active]:border-b-2 
  data-[state=active]:!border-b-foreground 
  data-[state=active]:text-foreground
  data-[state=active]:bg-transparent"
          >
            Unlisted
          </TabsTrigger>
          <TabsTrigger
            value="submissions"
            className="rounded-none border-0 flex-0 text-sm transition-all
  text-muted-foreground hover:text-foreground
  data-[state=active]:shadow-none 
  data-[state=active]:border-b-2 
  data-[state=active]:!border-b-foreground 
  data-[state=active]:text-foreground
  data-[state=active]:bg-transparent"
          >
            Submissions
          </TabsTrigger>
        </TabsList>
        <TabsContent value="drafts" className="mt-6">
          {drafts.length > 0 ? (
            <>
              <div className="flex justify-between text-sm text-muted-foreground mb-4.5">
                <span>Latest</span>
                <div className="flex gap-28">
                  <span>Publication</span>
                  <span>Status</span>
                  <span></span>
                </div>
              </div>

              <div className="space-y-4">
                {drafts.map((draft) => (
                  <StoryItem
                    key={draft._id}
                    story={draft}
                    onRemove={() => {
                      setIsDelete(true);
                      setRemoveId(draft._id);
                    }}
                  />
                ))}
              </div>
            </>
          ) : (
            <p className="text-muted-foreground text-center py-12">
              You haven’t drafted any public stories yet.
            </p>
          )}
        </TabsContent>
        <TabsContent value="published" className="mt-6">
          {publishes.length > 0 ? (
            <>
              <div className="flex justify-between text-sm text-muted-foreground mb-4.5">
                <span>Latest</span>
                <div className="flex gap-28">
                  <span>Publication</span>
                  <span>Status</span>
                  <span></span>
                </div>
              </div>

              <div className="space-y-4">
                {publishes.map((publish) => (
                  <StoryItem
                    key={publish._id}
                    story={publish}
                    onRemove={() => {
                      setIsDelete(true);
                      setRemoveId(publish._id);
                    }}
                  />
                ))}
              </div>
            </>
          ) : (
            <p className="text-muted-foreground text-center py-12">
              You haven’t published any public stories yet.
            </p>
          )}
        </TabsContent>
        <TabsContent value="unlisted" className="mt-6">
          <p className="text-muted-foreground text-center py-12">
            You don’t have any unlisted stories.
          </p>
        </TabsContent>
        <TabsContent value="submissions" className="mt-6">
          <p className="text-muted-foreground text-center py-12">
            No submissions to see here right now.
          </p>
        </TabsContent>
      </Tabs>
      {isDelete && (
        <AlertDialog open={isDelete} onOpenChange={setIsDelete}>
          {" "}
          <AlertDialogContent className={"h-[200px]"}>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete story</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this post? This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-full">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive hover:bg-destructive/90 rounded-full"
                onClick={() => removePostHandler(removeId)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
export async function getServerSideProps(context) {
  const { token, refreshToken } = context.req.cookies;
  await connectToDB();
  if (!token) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }
  const validToken = verifyToken(token);
  const validRefreshToken = verifyRefreshToken(refreshToken);
  if (!validToken && !validRefreshToken) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }
  const user = await usersModel.findOne({
    email: validToken.email || validRefreshToken.email,
  });
  if (!user) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }
  return { props: {} };
}
