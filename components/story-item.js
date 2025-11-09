import { relativeTimeFormat } from "@/lib/utils";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { LinkIcon, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ImageKitProvider } from "@imagekit/next";

const StoryItem = ({ story, onRemove }) => {
  
  return (
    <div className="flex items-center justify-between py-4 border-b last:border-0">
      <Link href={`/editor/${story._id}`}>
        <div className="flex items-center gap-4">
          <ImageKitProvider urlEndpoint="https://ik.imagekit.io/gv5d2avxy">
            <Image
              src={story.postCover?.imageUrl || "/images/placeholder.webp"}
              alt={story.title}
              width={80}
              height={80}
              className="object-cover rounded-md w-[80px] h-[65px]"
              data-ai-hint={story.title}
            />
          </ImageKitProvider>
          <div>
            <h3 className="font-bold text-base mb-2.5 truncate">{story.title||story.content?.blocks[0]?.data.text||"Untitled Story"}</h3>
            <p className="text-xs text-muted-foreground">
              {story.readTime || 1} min read ({story.content?.blocks?.length}{" "}
              words) &middot; Updated {relativeTimeFormat(story.updatedAt)}
            </p>
          </div>
        </div>
      </Link>
      <div className="flex items-center gap-22">
        <span className="text-sm text-muted-foreground w-20 text-center"></span>
        <span className="text-sm text-muted-foreground w-12 text-center"></span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <LinkIcon className="mr-2 h-4 w-4" />
              <span>Copy link</span>
            </DropdownMenuItem>
            <Link href={`/editor/${story._id}`}>
              <DropdownMenuItem>Edit story</DropdownMenuItem>
            </Link>
            <DropdownMenuItem>Submit to publication</DropdownMenuItem>
            <DropdownMenuItem>View settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={(e) => {
                onRemove();
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete story</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default StoryItem;
