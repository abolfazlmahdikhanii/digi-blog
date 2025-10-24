import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "sonner";

export function CommentForm({
  isReply = false,
  onCancel,
  onComment,
  imageUrl,
  commentId,
  onRefetch,
}) {
  const [comment, setComment] = useState("");
  const { query } = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!comment.trim()) return;
      const newComment = {
        content: comment,
        commentId,
      };
      const res = await fetch(`/api/comments/${query.postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newComment),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to add comment");
      }
      toast.success("Add Comment Successfully");
      setComment("");
      // onCancel();
      onRefetch();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={isReply ? "mt-4" : "mt-8"}>
      <div className="flex flex-col items-start gap-4">
        <div className="flex items-center gap-x-3">
          <Avatar className={isReply ? "h-8 w-8" : "h-10 w-10"}>
            <AvatarImage src={imageUrl} alt="Current User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <p>abmk</p>
        </div>
        <div className="w-full">
          <Textarea
            placeholder={
              isReply ? "Write a reply..." : "What are your thoughts?"
            }
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mb-2 resize-none max-w-4xl min-h-[30px] h-auto"
          />
          <div className="flex justify-end gap-2">
            {isReply && onCancel && (
              <Button type="button" variant="ghost" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={!comment.trim()}
              onClick={handleSubmit}
            >
              {isReply ? "Reply" : "Comment"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
