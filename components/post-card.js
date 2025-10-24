import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

export default function PostCard({
  _id,
  author,
  profileImage,
  createdAt,
  readTime,
  postCover,
  title,
  shortDescription,
  comments,
  likes,
  category,
}) {
  return (
    <div className="flex flex-col py-4 border-b ">
      <div className="flex flex-row-reverse sm:flex-row gap-8">
        <div className="flex-1 space-y-3">
          <Link href={`/profile/@${author?.username}`} className="">
            <div className="flex items-center gap-2 mb-5">
              <Avatar className="h-6.5 w-6.5">
                <AvatarImage
                  src={author?.profileImage}
                  alt={author?.name}
                />
                <AvatarFallback>
                  {author?.name?.toUpperCase().charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-semibold hover:underline dark:text-neutral-300">
                {author?.name}
              </span>
            </div>
          </Link>
          <Link
            href={`/post/${_id}`}
            className="hover:text-primary transition-colors "
          >
            <h2 className="font-bold text-xl font-headline tracking-tight">
              {title}
            </h2>
          </Link>
          <p className="text-muted-foreground text-base mt-2">
            {shortDescription}
          </p>
          <div className="flex items-center justify-between text-muted-foreground text-sm pt-4">
            <div className="flex items-center gap-5.5">
              <span className="text-xs">{relativeTimeFormat(createdAt)}</span>

              <button className="h-6 w-6 text-muted-foreground hover:text-foreground">
                <ThumbsUp className="h-3.5 w-3.5" />
              </button>
              <div className="flex items-center gap-1">
                <p className=" text-muted-foreground hover:text-foreground">
                  <MessageCircle className="h-3.5 w-3.5" />
                </p>
                <span className="text-xs">{comments}</span>
              </div>
              {category && (
                <Badge
                  variant="default"
                  className="bg-blue-50 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900 py-0.5 text-xs px-2"
                >
                  {capitalize(category?.name)}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button className="h-8 w-8 text-muted-foreground hover:text-foreground ">
                <Bookmark className="h-5 w-5" />
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
        <div className="sm:w-1/3  flex-shrink-0">
          <Link href={`/post/${_id}`} className="block">
            <div className="aspect-[4/3] relative max-w-[200px]">
              <ImageKitProvider urlEndpoint="https://ik.imagekit.io/gv5d2avxy">
                <Image
                  src={postCover || "/images/placeholder.webp"}
                  alt={title}
                  fill
                  className="object-cover rounded-md"
                  data-ai-hint={title}
                />
              </ImageKitProvider>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
