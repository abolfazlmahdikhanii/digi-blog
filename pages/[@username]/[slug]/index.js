import { CommentsSection } from "@/components/comments-section";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import connectToDB from "@/configs/db";
import { formatDate, relativeTimeFormat } from "@/lib/utils";
import commentsModel from "@/models/comments";
import postModel from "@/models/posts";
import {
  Bookmark,
  BookmarkPlus,
  Clapperboard,
  MessageCircle,
  MoreHorizontal,
  Share,
  ThumbsUp,
} from "lucide-react";
import { isValidObjectId } from "mongoose";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import postLikesModel from "@/models/postLikes";
import { toast } from "sonner";
import { useState } from "react";
import { SaveToList } from "@/components/save-to-list";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useFollow from "@/hooks/useFollow";
import { Spinner } from "@/components/ui/spinner";
import FollowBtn from "@/components/FollowBtn";
import HoverProfile from "@/components/hover-profile";

const TextEditor = dynamic(() => import("@/components/text-editor"), {
  ssr: false,
});

export default function PostPage({ post, totalComments, comments, likes }) {
  const { query } = useRouter();
  const { user } = useAuth();

  const queries = useQueries({
    queries: [
      {
        queryKey: [`post-${post._id}-comment`],
        initialData: { comments, totalComments },
        queryFn: () =>
          fetch(`/api/post/${post._id}/comments`).then((res) => res.json()),
      },
      {
        initialData: { likes },
        queryKey: [`post-${post._id}-like`],
        queryFn: () =>
          fetch(`/api/post/${post._id}/like`).then((res) => res.json()),
      },
    ],
  });
  const [commentsQuery, likesQuery, saveQuery] = queries;

  const newComments = commentsQuery.data?.comments || comments;
  const newTotalComment = commentsQuery.data?.totalComments || totalComments;
  const isLoadingComments = commentsQuery.isLoading;
  const refetchComments = commentsQuery.refetch;

  const likesData = likesQuery.data;
  const isLoadingLikes = likesQuery.isLoading;
  const refetchLikes = likesQuery.refetch;

  const likeHandler = async (e, id) => {
    e.preventDefault();
    try {
      if (!user) toast.warning("You Should Signin!");

      const res = await fetch(`/api/post/${post._id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to add Like");
      }
      refetchLikes();
    } catch (error) {
      toast.error(error.message);
    }
  };
  
  return (
    <div className="container mx-auto px-4 pt-2 pb-12 max-w-4xl">
      <article className="prose dark:prose-invert lg:prose-xl mx-auto">
        <h1 className="font-headline font-bold text-3xl leading-[1.5] mb-2.5">
          {post?.title}
        </h1>
        <p className="text-neutral-400">{post?.shortDescription}</p>
        <div className="flex items-center gap-4 my-8">
          <div className="flex items-center gap-x-3">
            <HoverProfile author={post?.author} size="lg" />
            <FollowBtn username={query["@username"].replace("@", "")} />
            <p className="text-sm text-muted-foreground not-prose flex items-center gap-x-2.5">
              <span>{post?.readTime} min read</span> ·{" "}
              <span className="">
                {post?.createdAt && relativeTimeFormat(post?.createdAt)}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5 border-y py-4 my-8">
          <div className="flex items-center gap-2.5">
            <button
              className=" text-muted-foreground hover:text-foreground "
              onClick={likeHandler}
            >
              <ThumbsUp
                className={`h-4.5 w-4.5 ${
                  likesData?.isCurrentUserLike ? "text-blue-600 " : ""
                }`}
              />
            </button>
            <span className="font-bold text-sm">
              {likesData.likes ?? likes ?? 0}
            </span>
          </div>
          <Sheet className="">
            <SheetTrigger asChild>
              <button className=" text-muted-foreground hover:text-foreground flex items-center gap-2.5">
                <MessageCircle className="h-4.5 w-4.5" />
                <span className="font-bold text-sm text-white">
                  {newTotalComment || totalComments}
                </span>
              </button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader className={"border-b w-11/12 mx-auto"}>
                <SheetTitle className={"text-2xl font-bold font-headline"}>
                  Response ({totalComments})
                </SheetTitle>
              </SheetHeader>
              <div className="w-[88%] mx-auto">
                {Boolean(post.isShowComment) && (
                  <CommentsSection
                    comments={newComments || comments}
                    total={totalComments}
                    refetch={refetchComments}
                    postId={post._id}
                    isSheet
                  />
                )}
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex-grow" />
          <SaveToList postId={post?._id} />
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-muted-foreground hover:text-foreground [&_svg]:!size-5"
          >
            <Share className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-muted-foreground hover:text-foreground [&_svg]:!size-5"
          >
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>

        <div className="post">
          <TextEditor initialData={post?.content} readOnly />
        </div>
      </article>
      {Boolean(post.isShowComment) && (
        <CommentsSection
          comments={newComments || comments}
          total={totalComments}
          refetch={refetchComments}
          postId={post._id}
        />
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  await connectToDB();
  try {
    const { slug } = context.query;

    // if (!isValidObjectId(postId)) {
    //   return {
    //     notFound: true,
    //   };
    // }
    const detail = await postModel
      .findOne({ slug: slug })
      .populate("topics")
      .populate("author")
      .lean();

    if (!detail) {
      return {
        redirect: {
          notFound: true,
        },
      };
    }

    // Fetch comments
    const comments = await commentsModel
      .find({
        post: detail._id,
        parentComment: null,
        status: "pending", // Add status filter here too
      })
      .populate({
        path: "replies",
        match: { status: "pending" },
        select: "content author createdAt parentComment",
        populate: { path: "author", select: "name username profileImage" },
      })
      .populate("author", "name username profileImage")
      .lean()
      .sort({ createdAt: -1 }); // Latest comments first

    const totalComments = await commentsModel.countDocuments({
      status: "pending",
      postId: detail._id,
    });
    const likes = await postLikesModel.countDocuments({
      postId: detail._id,
    });

    return {
      props: {
        post: JSON.parse(JSON.stringify(detail)),
        comments: JSON.parse(JSON.stringify(comments)),
        totalComments,
        likes,
      },
    };
  } catch (error) {
    return {
      props: {
        post: [],
        comments: [],
        totalComments: 0,
        likes: 0,
      },
    };
  }
}
