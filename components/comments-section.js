import { useRouter } from "next/router";
import { CommentForm } from "./comment-form";
import { CommentThread } from "./comment-thread";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export function CommentsSection({ comments = [], total, refetch }) {
  const { query } = useRouter();
    const { user } = useAuth();
  const handleSubmitLike = async (e, id) => {
    e.preventDefault();
    try {
      if (!user) toast.warning("You Should Signin!");
      const newLike = {
        commentId: id,
      };
      const res = await fetch(`/api/post/${query.postId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newLike),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to add comment");
      }

      refetch([`post-${query.postId}-comment`]);
      console.log(comments);
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div className="mt-12 pt-8 border-t">
      <h2 className="text-2xl font-bold font-headline mb-4">
        Responses ({total})
      </h2>
      <CommentForm isReply={false} onRefetch={refetch} />
      <div className="mt-8 divide-y">
        {!!comments.length &&
          comments.map((comment) => (
            <CommentThread
              key={comment._id}
              {...comment}
              onRefetch={refetch}
              handleSubmitLike={ handleSubmitLike}
            />
          ))}
      </div>
    </div>
  );
}
