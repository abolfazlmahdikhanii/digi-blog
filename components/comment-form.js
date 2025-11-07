import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "sonner";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "./ui/input-group";
import TextareaAutosize from "react-textarea-autosize";
import { Spinner } from "./ui/spinner";
import { useAuth } from "@/context/AuthContext";
import { capitalize } from "lodash";

export function CommentForm({
  isReply = false,
  onCancel,
  onComment,
  imageUrl,
  commentId,
  onRefetch,
  isSheet,
  postId,
}) {
  const { user } = useAuth();
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!user) {
        toast.warning("You Should Signin!");
        return;
      }
      if (!comment.trim()) toast.error("Comment Is Empty!");
      if (followLoading) return;
      setIsLoading(true);
      const newComment = {
        content: comment,
        commentId,
      };
      const res = await fetch(`/api/comments/${postId}`, {
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
      setIsLoading(false);
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={isReply ? "mt-4" : "mt-8"}>
      <div className="flex flex-col items-start gap-4">
        <div className="flex items-center gap-x-3">
          <Avatar className={isReply ? "h-8 w-8" : "h-10 w-10"}>
            <AvatarImage src={user?.profileImage} alt="Current User" />
            <AvatarFallback>
              {user?.name?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <p>{capitalize(user?.name)}</p>
        </div>
        {!isSheet ? (
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
                disabled={!comment.trim() || isLoading}
                onClick={handleSubmit}
              >
                {isReply ? "Reply" : "Comment"} {isLoading && <Spinner />}
              </Button>
            </div>
          </div>
        ) : (
          <InputGroup>
            <TextareaAutosize
              data-slot="input-group-control"
              className="flex field-sizing-content min-h-16 w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-base transition-[color,box-shadow] outline-none md:text-sm"
              placeholder="what are you thoughts?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <InputGroupAddon align="block-end">
              <InputGroupButton
                className="ml-auto"
                size="sm"
                variant="default"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                Submit {isLoading && <Spinner />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        )}
      </div>
    </form>
  );
}
