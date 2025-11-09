"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { Label } from "@/components/ui/label";
import { Bookmark, Lock, ArrowLeft, BookmarkPlus } from "lucide-react";
import { Separator } from "./ui/separator";

import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useQueries, useQuery } from "@tanstack/react-query";
import { ScrollArea } from "./ui/scroll-area";
import { useRouter } from "next/router";
import CreateList from "./create-list";

export function SaveToList({ postId }) {
  const { query } = useRouter();

  const queries = useQueries({
    queries: [
      {
        queryKey: [`save-list-${postId}`],
        queryFn: () =>
          fetch(`/api/save-lists?id=${postId}`).then((res) => res.json()),
      },
      {
        queryKey: [`post-${postId}-save`],
        queryFn: () =>
          fetch(`/api/post/${postId}/save`).then((res) => res.json()),
      },
    ],
  });
  const [listQuery, saveQuery] = queries;

  const saveLists = listQuery.data;
  const listRefetch = listQuery.refetch;
  const isSave = saveQuery.data;
  const refetchSave = saveQuery.refetch;

  const user = useAuth();

  const saveHandler = async (listId) => {
    try {
      if (!user) {
         toast.warning("You Should Signin!")
         return
      }
      if (!listId) return;
      const res = await fetch(`/api/post/${postId}/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ listId }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to add comment");
      }
      refetchSave();
      listRefetch();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 text-muted-foreground hover:text-foreground [&_svg]:!size-5"
        >
          {!isSave?.isUserSave ? (
            <BookmarkPlus className="h-5 w-5" />
          ) : (
            <Bookmark className="h-5 w-5 fill-blue-600 stroke-blue-600" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div>
          <ScrollArea className="space-y-2  h-[200px]">
            {saveLists && saveLists?.lists?.length > 0 ? (
              saveLists.lists.map((item) => (
                <div
                  className="flex items-center justify-between p-4"
                  key={item._id}
                >
                  <div className="flex items-center gap-3 cursor-pointer">
                    <Checkbox
                      id={item._id}
                      className="w-4 h-4 rounded-sm data-[state=checked]:bg-green-600 data-[state=checked]:text-white border-gray-400"
                      onCheckedChange={() => saveHandler(item._id)}
                      defaultChecked={
                        item.saveItems && item.saveItems.length ? true : false
                      }
                    />
                    <Label
                      htmlFor={item._id}
                      className="font-semibold text-base cursor-pointer"
                    >
                      {item.name}
                    </Label>
                  </div>
                  {item.isPrivate && (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              ))
            ) : (
              <div className="grid place-items-center h-[200px]">
                <p>List Is Empty !</p>
              </div>
            )}
          </ScrollArea>
          <Separator />
          <CreateList listRefetch={listRefetch}>
            <Button
              variant="ghost"
              className="w-full justify-start p-4 text-green-600 hover:text-green-700 h-12"
            >
              Create new list
            </Button>
          </CreateList>
        </div>
      </PopoverContent>
    </Popover>
  );
}
