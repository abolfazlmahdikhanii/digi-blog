"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageSquare, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { CommentForm } from "./comment-form";
import { capitalize } from "lodash";
import { relativeTimeFormat } from "@/lib/utils";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export function CommentThread({
  author,
  createdAt,
  content,
  _id,
  replies,
  isReplyComment,
  likeCount,
  onRefetch,
  handleSubmitLike,
  isLiked,
  isSheet,
  postId
}) {
  const [isReplying, setIsReplying] = useState(false);
 

  return (
    <div className="py-6 border-b last:border-b-0">
      <div className="flex items-start gap-4 ">
        <Link href={`/@${author?.username}`}>
          <Avatar className="h-8 w-8">
            <AvatarImage src={author?.profileImage} alt={author?.name} />
            <AvatarFallback>
              {author.name?.toUpperCase().charAt(0)}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href={`/@${author.username}}`}
                className="font-semibold hover:underline"
              >
                {capitalize(author.name)}
              </Link>
              <p className="text-xs text-muted-foreground mt-0.5">
                {relativeTimeFormat(createdAt)}
              </p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="px-1 ">
        <p className="mt-4 text-foreground/90">{content}</p>
        <div className="mt-5 flex items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-x-2">
            <button
              className="cursor-pointer"
              onClick={(e) => handleSubmitLike(e, _id)}
            >
              <ThumbsUp
                className={`h-4.5 w-4.5 ${isLiked ? "text-blue-500" : ""}`}
              />
            </button>
            <span className="text-xs">{likeCount}</span>
          </div>
          {!isReplyComment && (
            <Button
              variant="ghost"
              className="h-8  px-2 underline "
              onClick={() => setIsReplying(!isReplying)}
            >
              <span className="text-xs">Reply</span>
            </Button>
          )}
        </div>

        {isReplying && (
          <div className="mt-4">
            <CommentForm
              commentId={_id}
              isReply
              onCancel={() => setIsReplying(false)}
              onComment={() => setIsReplying(false)}
              onRefetch={onRefetch}
              isSheet={isSheet}
              postId={postId}
            />
          </div>
        )}
      </div>
      <div className="pl-4 mt-2">
        {!!replies?.length &&
          replies?.map((comment) => (
            <CommentThread
              isSheet={isSheet}
              key={comment._id}
              {...comment}
              isReplyComment
              handleSubmitLike={(e) => handleSubmitLike(e, comment._id)}
              postId={postId}
            />
          ))}
      </div>
    </div>
  );
}
