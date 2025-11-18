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

const Recommended = ({ posts, topic }) => {
  const { data, hasNextPage, isLoading, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["posts-recommend", topic],
      queryFn: async ({ pageParam }) => {
        const res = await fetch(
          `/api/topics/recommended?slug=${encodeURIComponent(
            topic.name
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
  const allRecommended =
    data?.pages.flatMap((page) => page.posts) || posts || [];

  return (
    <div className="w-11/12 mx-auto">
      <TopicWrapper
        title={`Recommended stories in "${topic.name}"`}
        pageName={"Recommended stories"}
        isBreadCrumb
      >
        <div className="flex flex-col gap-y-8">
          {allRecommended.map((story) => (
            <PostCard key={story._id} id={story._id} {...story} />
          ))}
          <ShowMoreBtn
            hasNextPage={hasNextPage}
            dataLength={allRecommended.length}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
          />
        </div>
      </TopicWrapper>
    </div>
  );
};

export default Recommended;

export async function getServerSideProps(context) {
  await connectToDB();
  try {
    const { slug } = context.query;
    const { token } = context.req.cookies;

    const topic = await topicModel.findOne({ slug });
    if (!topic) {
      return {
        notFound: true,
      };
    }
    const validToken = verifyToken(token);
    let currentUser = null;
    if (validToken) {
      currentUser = await usersModel.findOne({ email: validToken.email });
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
      .populate("postCover");

    const postsWithEngagement = allPosts.map((post) => ({
      ...post.toObject(),
      likesCount: post.likes?.length || 0,
      commentsCount: post.comments?.length || 0,
      totalEngagement:
        (post.likes?.length || 0) * 2 + (post.comments?.length || 0) * 3,
    }));

    // Get recommended posts (sorted by engagement + recency)
    const recommendedPosts = postsWithEngagement
      .sort((a, b) => {
        // Calculate score: engagement weighted by recency
        const now = Date.now();
        const aHoursSinceCreated =
          (now - new Date(a.createdAt).getTime()) / (1000 * 60 * 60);
        const bHoursSinceCreated =
          (now - new Date(b.createdAt).getTime()) / (1000 * 60 * 60);

        const aScore =
          (a.likesCount * 2 + a.commentsCount * 3) /
          Math.log10(Math.max(aHoursSinceCreated, 2));
        const bScore =
          (b.likesCount * 2 + b.commentsCount * 3) /
          Math.log10(Math.max(bHoursSinceCreated, 2));

        return bScore - aScore;
      })
      .slice(0, 10);

    return {
      props: {
        posts: JSON.parse(JSON.stringify(recommendedPosts)),
        topic: JSON.parse(JSON.stringify(topic)),
      },
    };
  } catch (error) {
    return {
      props: {
        posts: [],
      },
    };
  }
}
