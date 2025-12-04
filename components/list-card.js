"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { MoreHorizontal, Lock, Link2Icon, Trash2 } from "lucide-react";
import Link from "next/link";
import { capitalize } from "lodash";
import HoverProfile from "./hover-profile";
import { useState } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { toast } from "sonner";
import { ImageKitProvider } from "@imagekit/next";
export function ListCard({
  author,
  name,
  storyCount,
  isPrivate,
  description,
  saveItems,
  _id,
  refetch,
}) {
  const [isDelete, setIsDelete] = useState(false);

  const removeListHandler = async (id) => {
    try {
      const res = await fetch(`/api/lists/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to remove list");
      }

      toast.success("list removed successfully :)");
      setIsDelete(false);
      refetch();
    } catch (error) {
      toast.error("Failed to remove list");
    }
  };
  const updateStatusHandler = async (id) => {
    try {
      const res = await fetch(`/api/lists/${id}`, {
        method: "PUT",
      });

      if (!res.ok) {
        throw new Error("Failed to update list");
      }

      toast.success("list update successfully :)");

      refetch();
    } catch (error) {
      toast.error("Failed to update list");
    }
  };
  return (
    <>
      <Link
        href={`/@${author?.username}/list/${name}`}
        className="flex justify-between  p-6 border rounded-lg bg-card"
      >
        <div className="flex-1 mr-3">
          <div className="flex items-center gap-x-2">
            <Avatar className="h-6 w-6 ">
              <AvatarImage src={author?.profileImage} alt={author.name} />
              <AvatarFallback className={"capitalize"}>
                {author?.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="truncate text-sm capitalize">{author?.name}</span>
          </div>
          <h2 className="text-2xl font-bold font-headline my-4">
            {capitalize(name)}
          </h2>
          {description && <p>{description}</p>}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-sm">
                {saveItems ? saveItems.length : 0} stories
              </span>
              {isPrivate && <Lock className="h-3.5 w-3.5" />}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <span>Copy link</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    updateStatusHandler(_id);
                  }}
                >
                  Make to {isPrivate ? "Public" : "Private"}
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDelete(true);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete List</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className=" w-1/2 md:w-[270px] h-full">
          <div
            className={`grid grid-cols-[1fr_30%_15%] gap-px overflow-hidden rounded-md h-full min-h-[144px]`}
          >
            {[0, 1, 2].map((index) => {
              const item = saveItems?.[index];
              const hasImage = item?.postId?.postCover;
              const img=item?.postId?.postCover?.imageUrl
               
              return (
                <div
                  key={item?._id}
                  className={`relative z-[${3 - index}] w-full h-full ${
                    !hasImage ? "bg-gray-400" : ""
                  }`}
                >
                  {hasImage && (
                    <ImageKitProvider urlEndpoint="https://ik.imagekit.io/gv5d2avxy">
                      <Image
                        src={img|| "/images/placeholder.webp"}
                        alt={`List item ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </ImageKitProvider>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Link>

      {isDelete && (
        <AlertDialog open={isDelete} onOpenChange={setIsDelete}>
          {" "}
          <AlertDialogContent className={"h-[200px]"}>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete List</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this list? This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                className="rounded-full"
                onClick={() => setIsDelete(false)}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive hover:bg-destructive/90 rounded-full"
                onClick={() => removeListHandler(_id)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
