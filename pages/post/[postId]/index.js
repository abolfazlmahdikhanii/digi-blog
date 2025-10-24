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
import { redirect } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
const TextEditor = dynamic(() => import("@/components/text-editor"), {
  ssr: false,
});

export default function PostPage({ post, totalComments, comments }) {
  const { query } = useRouter();

  const { data, isLoading, refetch } = useQuery({
    queryKey: [`post-${query.postId}-comment`],
    initialData: comments,
    queryFn: () =>
      fetch(`/api/post/${query.postId}/comments`).then((res) => res.json()),
  });
  const newComments = data?.comments;
  const newTotalComment = data?.totalComments;
  
  return (
    <div className="container mx-auto px-4 pt-2 pb-12 max-w-4xl">
      <article className="prose dark:prose-invert lg:prose-xl mx-auto">
        <h1 className="font-headline font-bold text-3xl">{post?.title}</h1>
        <p className="text-neutral-400">{post?.shortDescription}</p>
        <div className="flex items-center gap-4 my-8">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={post.author?.profileImage}
              alt={post.author?.username}
              data-ai-hint={post.author?.profileImage}
            />
            <AvatarFallback>
              {post.author?.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-x-3">
            <HoverCard>
              <HoverCardTrigger asChild>
                <Link
                  href={`/profile/@${post.author?.username.toLowerCase()}`}
                  className="flex items-center gap-3 hover:underline transition-all duration-150"
                >
                  <p className="font-semibold text-sm not-prose capitalize">
                    {post.author?.name}
                  </p>
                </Link>
              </HoverCardTrigger>
              <HoverCardContent>
                <div className="flex items-center justify-between">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={post.author?.profileImage}
                      alt={post.author?.username}
                    />
                    <AvatarFallback>
                      {post.author?.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    variant={"outline"}
                    className={"capitalize rounded-full h-10  self-end"}
                  >
                    Follow
                  </Button>
                </div>
                <div>
                  <p className="font-semibold text-lg not-prose capitalize mt-4 mb-2.5">
                    {post.author?.name}
                  </p>
                  <p className="text-xs leading-[1.7] text-neutral-400">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Dolores praesentium aperiam sequi ad nesciunt odio expedita
                    nam rem, voluptates
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>

            <Button
              variant={"outline"}
              className={"capitalize rounded-full h-10 px-4.5"}
            >
              Follow
            </Button>
            <p className="text-sm text-muted-foreground not-prose flex items-center gap-x-2.5">
              <span>{post?.readTime} min read</span> ·{" "}
              <span className="">
                {post?.createdAt && relativeTimeFormat(post?.createdAt)}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 border-y py-4 my-8">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-muted-foreground hover:text-foreground [&_svg]:!size-4.5"
            >
              <ThumbsUp className="h-6 w-6" />
            </Button>
            {/* <span className="font-bold">{post.likes}</span> */}
          </div>
          <div className="flex items-center gap-2.5">
            <button
              variant="ghost"
              size="icon"
              className=" text-muted-foreground hover:text-foreground "
            >
              <MessageCircle className="h-4.5 w-4.5" />
            </button>
            <span className="font-bold">
              {newTotalComment || totalComments}
            </span>
          </div>
          <div className="flex-grow" />
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-muted-foreground hover:text-foreground [&_svg]:!size-5"
          >
            <BookmarkPlus className="h-6 w-6" />
          </Button>
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

        {/* <div className="relative aspect-[16/9] w-full my-12">
          <Image
            src={post.postCover}
            alt={post.title}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
            data-ai-hint={post.title}
          />
        </div> */}

        <TextEditor initialData={post?.content} readOnly />
      </article>
      {Boolean(post.isShowComment) && (
        <CommentsSection
          comments={newComments || comments}
          total={totalComments}
          refetch={refetch}
        />
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  await connectToDB();
  try {
    const { postId } = context.query;
    if (!isValidObjectId(postId)) {
      return {
        notFound: true,
      };
    }
    const detail = await postModel
      .findOne({ _id: postId })

      .populate("category")
      .populate("author")
      .lean();
    const comments = await commentsModel
      .find({ post: postId, parentComment: null })
      .populate({
        path: "replies",
        match: { status: "pending" },
        select: "content author createdAt parentComment",
        populate: { path: "author", select: "name username profileImage" },
      })
      .populate("author")
      .populate("likes");

    if (!detail) {
      return {
        redirect: {
          destination: "/",
        },
      };
    }
    const totalComments = await commentsModel.countDocuments({
      status: "pending",
    });

    return {
      props: {
        post: JSON.parse(JSON.stringify(detail)),
        comments: JSON.parse(JSON.stringify(comments)),
        totalComments,
      },
    };
  } catch (error) {
    return {
      props: {
        post: [],
        comments: [],
        totalComments: 0,
      },
    };
  }
}
