import PostCard from "@/components/post-card";
import TopicWrapper from "@/components/topic-wrapper";
import connectToDB from "@/configs/db";
import postModel from "@/models/posts";
import topicModel from "@/models/topics";
import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import { ChevronDown } from "lucide-react";
import ShowMoreBtn from "@/components/show-more-btn";
import { verifyRefreshToken } from "@/lib/utils";
import PostsListSkeleton from "@/components/post-card-skeleton";
import { useRouter } from "next/router";

const Archive = ({ posts, topic }) => {
  const { query } = useRouter();
  const { data, hasNextPage, isLoading, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["posts", topic],
      queryFn: async ({ pageParam }) => {
        const res = await fetch(
          `/api/topics/archive?slug=${encodeURIComponent(
            topic.name || query.slug
          )}&page=${pageParam}&limit=10`
        );
        if (!res.ok) throw new Error("Failed to fetch stories");
        return res.json();
      },
      getNextPageParam: (lastPage, pages) => {
        return lastPage.hasMore ? pages.length + 1 : undefined;
      },
      initialPageParam: 1,
    });
  if (isLoading) {
    return (
      <div>
        <PostsListSkeleton count={5} />
      </div>
    );
  }
  const allArchive = data?.pages.flatMap((page) => page.posts) || posts || [];

  return (
    <div className="w-11/12 mx-auto">
      <TopicWrapper
        title={`Archive of stories in "${topic.name || query.slug}"`}
        pageName={"Archive"}
        isBreadCrumb
      >
        <div className="flex flex-col gap-y-8">
          {allArchive.map((story) => (
            <PostCard key={story._id} id={story._id} {...story} />
          ))}
          <ShowMoreBtn
            hasNextPage={hasNextPage}
            dataLength={allArchive.length}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
          />
        </div>
      </TopicWrapper>
    </div>
  );
};

export default Archive;
export async function getServerSideProps(context) {
  await connectToDB();
  try {
    const { slug } = context.query;
    const { token, refreshToken } = context.req.cookies;

    const topic = await topicModel.findOne({ slug });
    if (!topic) {
      return {
        notFound: true,
      };
    }
    const validToken = verifyToken(token);
    const validRefreshToken = verifyRefreshToken(refreshToken);
    let currentUser = null;
    if (validToken || validRefreshToken) {
      currentUser = await usersModel.findOne({
        email: validToken.email || validRefreshToken.email,
      });
    }
    // Get all posts for this topic
    const allPosts = await postModel
      .find({
        topics: { $in: [topic._id] },
        status: "published",
      })
      .populate("topics")
      .populate({ path: "comments" })
      .populate({ path: "likes" })
      .populate({ path: "save", match: { userId: currentUser?._id } })
      .populate("author", "name username")
      .populate("postCover")
      .limit(10)
      .sort({ updatedAt: -1 });

    return {
      props: {
        posts: JSON.parse(JSON.stringify(allPosts)),
        topic: JSON.parse(JSON.stringify(topic)),
      },
    };
  } catch (error) {
    return {
      props: {
        posts: [],
        topic: [],
      },
    };
  }
}
