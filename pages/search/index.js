"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Bookmark,
  ChevronDown,
  MessageCircle,
  MoreHorizontal,
  ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import connectToDB from "@/configs/db";
import saveListModel from "@/models/saveList";
import PostCard from "@/components/post-card";
import FollowItem from "@/components/user-follow-item";
import { ListCard } from "@/components/list-card";
import usersModel from "@/models/users";
import postModel from "@/models/posts";
import topicModel from "@/models/topics";
import { Badge } from "@/components/ui/badge";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import { verifyRefreshToken, verifyToken } from "@/lib/utils";
import ShowMoreBtn from "@/components/show-more-btn";
import FollowItemSkeleton from "@/components/follow-item-skeleton";
import BadgeSkeleton from "@/components/badge-skeleton";
import PostsListSkeleton from "@/components/post-card-skeleton";

export default function SearchPage({ stories, people, lists, topics }) {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  if (!query) {
    return (
      <div className="container mx-auto px-4 max-w-2xl py-8">
        <h1 className="text-2xl md:text-3xl text-foreground/80 font-headline">
          Enter a search term to begin.
        </h1>
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="container mx-auto px-4 max-w-4xl py-8">
        <h1 className="text-2xl md:text-5xl text-foreground/80 md:font-semibold font-headline mb-16 flex gap-3.5">
          Results for{" "}
          <span className="text-foreground font-bold line-clamp-1">
            {query}
          </span>
        </h1>

        <Tabs defaultValue="stories">
          <TabsList className="bg-transparent p-0 border-b w-full justify-start rounded-none gap-x-6">
            <TabsTrigger
              value="stories"
              className="rounded-none border-0 flex-0 text-sm transition-all
  text-muted-foreground hover:text-foreground
  data-[state=active]:shadow-none 
  data-[state=active]:border-b-2 
  data-[state=active]:!border-b-foreground 
  data-[state=active]:text-foreground
  data-[state=active]:bg-transparent"
            >
              Stories
            </TabsTrigger>
            <TabsTrigger
              value="people"
              className="rounded-none border-0 flex-0 text-sm transition-all
  text-muted-foreground hover:text-foreground
  data-[state=active]:shadow-none 
  data-[state=active]:border-b-2 
  data-[state=active]:!border-b-foreground 
  data-[state=active]:text-foreground
  data-[state=active]:bg-transparent"
            >
              People
            </TabsTrigger>

            <TabsTrigger
              value="topics"
              className="rounded-none border-0 flex-0 text-sm transition-all
  text-muted-foreground hover:text-foreground
  data-[state=active]:shadow-none 
  data-[state=active]:border-b-2 
  data-[state=active]:!border-b-foreground 
  data-[state=active]:text-foreground
  data-[state=active]:bg-transparent"
            >
              Topics
            </TabsTrigger>
            <TabsTrigger
              value="lists"
              className="rounded-none border-0 flex-0 text-sm transition-all
  text-muted-foreground hover:text-foreground
  data-[state=active]:shadow-none 
  data-[state=active]:border-b-2 
  data-[state=active]:!border-b-foreground 
  data-[state=active]:text-foreground
  data-[state=active]:bg-transparent"
            >
              Lists
            </TabsTrigger>
          </TabsList>
          <TabsContent value="stories" className="mt-6">
            <SearchStories initialStories={stories} query={query} />
          </TabsContent>
          <TabsContent value="people" className="mt-6">
            <SearchPeople initialPeople={people} query={query} />
          </TabsContent>

          <TabsContent value="topics" className="mt-6">
            <SearchTopics initialTopics={topics} query={query} />
          </TabsContent>
          <TabsContent value="lists" className="mt-6">
            <SearchLists initialLists={lists} query={query} />
          </TabsContent>
        </Tabs>
      </div>
    </Suspense>
  );
}

const SearchStories = ({ initialStories, query }) => {
  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["stories", query],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await fetch(
          `/api/search/stories?q=${encodeURIComponent(
            query
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
      <div className="flex flex-col gap-y-8">
        <PostsListSkeleton count={5} />
      </div>
    );
  }
  const stories =
    data?.pages.flatMap((page) => page.stories) || initialStories || [];

  return (
    <>
      {stories.length > 0 ? (
        <div className="flex flex-col gap-y-8">
          {stories.map((story) => (
            <PostCard key={story._id} id={story._id} {...story} />
          ))}

          <ShowMoreBtn
            hasNextPage={hasNextPage}
            dataLength={stories.length}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
          />
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-12">
          No stories found for &quot;{query}&quot;.
        </p>
      )}
    </>
  );
};
const SearchTopics = ({ initialTopics, query }) => {
  const { data, hasNextPage, fetchNextPage, isLoading, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["topics", query],
      queryFn: async ({ pageParam }) => {
        const res = await fetch(
          `/api/search/topics?q=${encodeURIComponent(
            query
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
      <div className="flex items-center flex-wrap md:gap-8 gap-6">
        {Array(9)
          .fill(0)
          .map((item) => (
            <BadgeSkeleton />
          ))}
      </div>
    );
  }
  const topics =
    data?.pages.flatMap((page) => page.topics) || initialTopics || [];

  return (
    <>
      {topics.length > 0 ? (
        <div className="flex flex-col">
          <div className="flex items-center flex-wrap md:gap-8 gap-6">
            {topics.map((item) => (
              <Link href={`/tags/${item.slug}`} key={item._id}>
                <Badge
                  variant="secondary"
                  className=" cursor-pointer py-[9px] px-5 rounded-full capitalize text-sm"
                >
                  {item.name}
                </Badge>
              </Link>
            ))}
          </div>
          <ShowMoreBtn
            hasNextPage={hasNextPage}
            dataLength={topics.length}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
          />
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-12">
          No Topics found for &quot;{query}&quot;.
        </p>
      )}
    </>
  );
};
const SearchPeople = ({ initialPeople, query }) => {
  const { data, hasNextPage, fetchNextPage, isLoading, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["people", query],
      queryFn: async ({ pageParam }) => {
        const res = await fetch(
          `/api/search/people?q=${encodeURIComponent(
            query
          )}&page=${pageParam}&limit=10`
        );
        if (!res.ok) throw new Error("Failed to fetch people");
        return res.json();
      },
      getNextPageParam: (lastPage, pages) => {
        return lastPage.hasMore ? pages.length + 1 : undefined;
      },
      initialPageParam: 1,
    });
  if (isLoading) {
    return (
      <>
        {Array(3)
          .fill(0)
          .map((item) => (
            <FollowItemSkeleton />
          ))}
      </>
    );
  }
  const people =
    data?.pages.flatMap((page) => page.people) || initialPeople || [];

  return (
    <>
      {people.length > 0 ? (
        <div className="flex flex-col  gap-y-8">
          {people.map((item) => (
            <FollowItem key={item._id} author={item} />
          ))}
          <ShowMoreBtn
            hasNextPage={hasNextPage}
            dataLength={people.length}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
          />
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-12">
          No People found for &quot;{query}&quot;.
        </p>
      )}
    </>
  );
};
const SearchLists = ({ initialLists, query }) => {
  const { data, hasNextPage, fetchNextPage, isLoading, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["lists", query],
      queryFn: async ({ pageParam }) => {
        const res = await fetch(
          `/api/search/lists?q=${encodeURIComponent(
            query
          )}&page=${pageParam}&limit=10`
        );
        if (!res.ok) throw new Error("Failed to fetch lists");
        return res.json();
      },
      getNextPageParam: (lastPage, pages) => {
        return lastPage.hasMore ? pages.length + 1 : undefined;
      },
      initialPageParam: 1,
    });
  const lists = data?.pages.flatMap((page) => page.lists) || initialLists || [];
 
  return (
    <>
      {lists.length > 0 ? (
        <div className="flex flex-col gap-y-8">
          {lists.map((item) => (
            <ListCard key={item._id} {...item} author={item.userId} saveItems={item.saveItems}/>
          ))}
          <ShowMoreBtn
            hasNextPage={hasNextPage}
            dataLength={lists.length}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
          />
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-12">
          No Lists found for &quot;{query}&quot;.
        </p>
      )}
    </>
  );
};

export async function getServerSideProps(context) {
  await connectToDB();
  try {
    const { q } = context.query;
    const { token, refreshToken } = context.req.cookies;

    const validToken = verifyToken(token);
    const validRefreshToken = verifyRefreshToken(refreshToken);
    let currentUser = null;
    if (validToken || validRefreshToken) {
      currentUser = await usersModel.findOne({
        email: validToken.email || validRefreshToken.email,
      });
    }
    if (!q.trim()) {
      return {
        props: { stories: [], people: [], topics: [], lists: [] },
      };
    }
    const trimmedQuery = q.trim();
    const [users, posts, topics, lists] = await Promise.all([
      usersModel
        .find({
          name: { $regex: trimmedQuery, $options: "i" },
        })
        .select("name username profileImage email") // add field selection
        .limit(10),

      postModel
        .find({
          title: { $regex: trimmedQuery, $options: "i" },
          status: "published",
        })
        .populate("topics", "name slug") // select only needed fields
        .populate("comments", "content createdAt") // be specific
        .populate("likes", "userId") // be specific
        .populate({
          path: "save",
          match: { userId: currentUser?._id },
          select: "userId listId",
        })
        .populate("author", "name username profileImage")
        .populate("postCover", "imageUrl fileName") // add field selection
        .limit(10)
        .sort({ updatedAt: -1 })
        .lean(), // add lean for better performance

      topicModel
        .find({
          name: { $regex: trimmedQuery, $options: "i" },
        })
        .select("name slug description") // add field selection
        .limit(10)
        .lean(),

      saveListModel
        .find({
          name: { $regex: trimmedQuery, $options: "i" },
          isPrivate: false,
        })
        .populate({
          path: "saveItems",
          options: {
            limit: 3, // limit items per list for search results
            sort: { createdAt: -1 },
          },
          populate: {
            path: "postId",
            select: "title slug createdAt", // select post fields you need
            populate: [
              {
                path: "author",
                select: "name username profileImage",
              },
              {
                path: "postCover",
                select: "imageUrl fileName",
              },
            ],
          },
        })
        .populate("userId", "name username profileImage") // add this to get list owner info
        .select("name description createdAt itemCount") // select list fields
        .limit(10)
        .lean(),
    ]);

    return {
      props: {
        stories: JSON.parse(JSON.stringify(posts)),
        people: JSON.parse(JSON.stringify(users)),
        topics: JSON.parse(JSON.stringify(topics)),
        lists: JSON.parse(JSON.stringify(lists)),
      },
    };
  } catch (error) {
    return {
      props: { stories: [], people: [], topics: [], lists: [] },
    };
  }
}
