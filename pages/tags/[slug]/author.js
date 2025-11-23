import PostCard from "@/components/post-card";
import TopicWrapper from "@/components/topic-wrapper";
import FollowItem from "@/components/user-follow-item";
import connectToDB from "@/configs/db";
import topicModel from "@/models/topics";
import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import { ChevronDown } from "lucide-react";
import ShowMoreBtn from "@/components/show-more-btn";
import usersModel from "@/models/users";
import { useRouter } from "next/router";

const Author = ({ author, topic }) => {
  const { query } = useRouter();
  const { data, hasNextPage, isLoading, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["author", topic],
      queryFn: async ({ pageParam }) => {
        const res = await fetch(
          `/api/topics/author?slug=${encodeURIComponent(
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
  const allAuthor = data?.pages.flatMap((page) => page.author) || author || [];

  return (
    <div className="w-11/12 mx-auto mt-8">
      <TopicWrapper
        title={`Who to author in "${topic.name || query.slug}"`}
        pageName={"Author"}
        isBreadCrumb
      >
        <div className="flex flex-col gap-y-8">
          {allAuthor.map((user) => (
            <FollowItem key={user._id} author={user} />
          ))}
          <ShowMoreBtn
            hasNextPage={hasNextPage}
            dataLength={allAuthor.length}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
          />
        </div>
      </TopicWrapper>
    </div>
  );
};

export default Author;
export async function getServerSideProps(context) {
  try {
    const { slug } = context.query;
    await connectToDB();
    const topic = await topicModel.findOne({ slug });
    if (!topic) {
      return {
        notFound: true,
      };
    }

    const whoToFollow = await usersModel
      .find({
        interests: { $in: [topic._id] },
      })
      .limit(10);

    return {
      props: {
        author: JSON.parse(JSON.stringify(whoToFollow)),
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
