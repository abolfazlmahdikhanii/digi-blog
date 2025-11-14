import Image from "next/image";
import Link from "next/link";

import {
  ThumbsUp,
  MessageCircle,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageKitProvider } from "@imagekit/next";
import { relativeTimeFormat } from "@/lib/utils";
import { capitalize } from "lodash";

import FollowBtn from "./FollowBtn";
import HoverProfile from "./hover-profile";

export default function PostCard({
  _id,
  author,
  profileImage,
  slug,
  createdAt,
  readTime,
  postCover,
  title,
  shortDescription,
  comments,
  likes,

  save,
  isSave,
  isCol = false,
}) {
  return (
    <div className={`flex flex-col py-4 ${!isCol ? "border-b " : ""}`}>
      <div
        className={`flex ${
          !isCol
            ? "flex-row-reverse sm:flex-row gap-8"
            : "flex-col-reverse gap-7"
        } `}
      >
        <div className="flex-1 space-y-3">
          <HoverProfile author={author} />

          <Link
            href={`/@${author?.username}/${slug}`}
            className="hover:text-primary transition-colors "
          >
            <h2 className="font-bold text-xl font-headline tracking-tight">
              {title}
            </h2>
          </Link>
          <p className="text-muted-foreground text-base mt-2 line-clamp-3">
            {shortDescription}
          </p>
          <div
            className={`flex items-center justify-between text-muted-foreground text-sm ${
              !isCol ? "pt-4" : "pt-3"
            }`}
          >
            <div className="flex items-center gap-5.5">
              <span className="text-xs">{relativeTimeFormat(createdAt)}</span>

              {likes && !!likes.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <p className=" text-muted-foreground hover:text-foreground">
                    <ThumbsUp className="h-3.5 w-3.5" />
                  </p>
                  <span className="text-xs">{likes ? likes.length : 0}</span>
                </div>
              )}
              {comments && !!comments.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <p className=" text-muted-foreground hover:text-foreground">
                    <MessageCircle className="h-3.5 w-3.5" />
                  </p>
                  <span className="text-xs">
                    {comments ? comments.length : 0}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button className="h-8 w-8 text-muted-foreground hover:text-foreground ">
                <Bookmark
                  className={`h-5 w-5 ${
                    (save &&
                      author._id.toString() === save[0]?.userId?.toString()) ||
                    isSave
                      ? "fill-blue-600 stroke-blue-600"
                      : ""
                  }`}
                />
              </button>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 text-muted-foreground hover:text-foreground"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className={`${!isCol ? "sm:w-1/4" : "sm:w-full "}  flex-shrink-0`}>
          <Link href={`/post/${_id}`} className="block">
            <div
              className={` relative ${
                !isCol ? "max-w-[200px] aspect-[4/3]" : "w-full h-[380px]"
              }`}
            >
              <ImageKitProvider urlEndpoint="https://ik.imagekit.io/gv5d2avxy">
                <Image
                  src={postCover?.imageUrl || "/images/placeholder.webp"}
                  alt={title}
                  fill
                  className="object-cover rounded-md aspect-auto   w-full"
               
                />
              </ImageKitProvider>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
