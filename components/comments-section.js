import { useRouter } from "next/router";
import { CommentForm } from "./comment-form";
import { CommentThread } from "./comment-thread";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export function CommentsSection({
  comments = [],
  total,
  refetch,
  isSheet = false,
  postId,
}) {
  const { user } = useAuth();
  const handleSubmitLike = async (e, id) => {
    e.preventDefault();
    try {
      if (!user) {
        toast.warning("You Should Signin!");
        return;
      }
      const newLike = {
        postId,
      };
      const res = await fetch(`/api/comments/${id}/like`, {
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

      refetch([`post-${postId}-comment`]);
     
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className={`${!isSheet ? "mt-12 pt-8 border-t" : "pt-3"}`}>
      {!isSheet && (
        <h2 className="text-2xl font-bold font-headline mb-4">
          Responses ({total})
        </h2>
      )}
      {user && (
        <CommentForm
          isReply={false}
          onRefetch={refetch}
          isSheet={isSheet}
          postId={postId}
        />
      )}
      <div className={`mt-8 divide-y ${isSheet ? "border-t" : ""}`}>
        {!!comments.length &&
          comments.map((comment) => (
            <CommentThread
              key={comment._id}
              {...comment}
              onRefetch={refetch}
              handleSubmitLike={handleSubmitLike}
              isSheet={isSheet}
              postId={postId}
            />
          ))}
      </div>
    </div>
  );
}
