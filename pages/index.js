import Link from "next/link";
import { Button } from "@/components/ui/button";
import PostCard from "@/components/post-card";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import connectToDB from "@/configs/db";

import { verifyRefreshToken, verifyToken } from "@/lib/utils";
import usersModel from "@/models/users";
import { useEffect } from "react";
import postModel from "@/models/posts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import followModel from "@/models/follows";
import PostsListSkeleton from "@/components/post-card-skeleton";

export default function Home({ initialPosts, initialUsersPosts }) {
  return (
    <div className="sm:w-[87%] w-[94%] mx-auto px-4 mt-3">
      <Tabs defaultValue="for-you">
        <TabsList className="bg-transparent p-0  border-b w-full justify-start rounded-none gap-x-6">
          <TabsTrigger
            value="for-you"
            className="rounded-none border-0 flex-0 text-sm transition-all
  text-muted-foreground hover:text-foreground
  data-[state=active]:shadow-none 
  data-[state=active]:border-b-2 
  data-[state=active]:!border-b-foreground 
  data-[state=active]:text-foreground
  data-[state=active]:bg-transparent"
          >
            For you
          </TabsTrigger>
          <TabsTrigger
            value="featured"
            className="rounded-none border-0 flex-0 text-sm transition-all
  text-muted-foreground hover:text-foreground
  data-[state=active]:shadow-none 
  data-[state=active]:border-b-2 
  data-[state=active]:!border-b-foreground 
  data-[state=active]:text-foreground
  data-[state=active]:bg-transparent"
          >
            Featured
          </TabsTrigger>
        </TabsList>
        <TabsContent value="for-you" className="mt-6">
          <UsersPosts initialUsersPosts={initialUsersPosts} />
        </TabsContent>
        <TabsContent value="featured" className="mt-6">
          <FeaturedPosts initialPosts={initialPosts} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

const FeaturedPosts = ({ initialPosts }) => {
  const { ref, inView } = useInView();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["featured-posts"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(`/api/post/featured?page=${pageParam}&limit=10`);
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json();
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);
  if (isLoading) {
    return (
      <div className="md:px-4">
        <PostsListSkeleton count={5} isCol={false} />
      </div>
    );
  }
  const posts = data?.pages.flatMap((page) => page.posts) || initialPosts || [];
  return (
    <div className=" md:px-4">
      <main>
        <div className="space-y-7">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <PostCard key={`${post._id}-${index}`} id={post._id} {...post} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center gap-y-3 mt-24 ">
              <p className="font-bold text-lg">No featured stories</p>
              <p className="text-muted-foreground text-center">
                Featured stories from the publications you follow will appear
                here.
              </p>
            </div>
          )}
          <div ref={ref} className="py-8">
            {isFetchingNextPage && (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
              </div>
            )}
            {!hasNextPage && data?.pages[0]?.posts.length > 0 && (
              <p className="text-center text-muted-foreground">
                No more posts to load
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const UsersPosts = ({ initialUsersPosts }) => {
  const { ref, inView } = useInView();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["users-posts"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(`/api/post/for-user?page=${pageParam}&limit=10`);
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json();
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);
  if (isLoading) {
    return (
      <div className="md:px-4">
        <PostsListSkeleton count={5} isCol={false} />
      </div>
    );
  }
  const posts =
    data?.pages.flatMap((page) => page.posts) || initialUsersPosts || [];

  return (
    <div className=" md:px-4">
      <main>
        <div className="space-y-7">
          {posts && posts.length > 0 ? (
            posts.map((post, index) => (
              <PostCard
                key={`${post?._id}-${index}`}
                id={post?._id}
                {...post}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center gap-y-3 mt-24 ">
              <p className="font-bold text-lg">No for you stories</p>
              <p className="text-muted-foreground text-center">
                for you stories from the topics you follow will appear here.
              </p>
            </div>
          )}
          <div ref={ref} className="py-8">
            {isFetchingNextPage && (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
              </div>
            )}
            {!hasNextPage && data?.pages[0]?.posts.length > 0 && (
              <p className="text-center text-muted-foreground">
                No more posts to load
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export async function getServerSideProps(context) {
  await connectToDB();

  try {
    const { token, refreshToken } = context.req.cookies;
    let currentUser = null;
    if (!token && !refreshToken) {
      return {
        redirect: {
          destination: "/welcome",
        },
      };
    }
    const validToken = verifyToken(token);
    const validRefreshToken = verifyRefreshToken(refreshToken);

    if (!validToken && !validRefreshToken) {
      return {
        redirect: {
          destination: "/welcome",
        },
      };
    }
    currentUser = await usersModel.findOne({
      email: validToken.email || validRefreshToken.email,
    });
    if (!currentUser) {
      return {
        redirect: {
          destination: "/welcome",
        },
      };
    }

    // const existingPostIds = posts.map((post) => post._id.toString());

    const usersPosts = await postModel
      .find({
        status: "published",
        $or: [
          {
            topics: { $in: currentUser.interests },
          },
          { author: currentUser._id },
        ],
      })
      .populate("topics")
      .populate({ path: "comments" })
      .populate({ path: "likes" })
      .populate({ path: "save", match: { userId: currentUser?._id } })
      .populate("author", "_id name username")
      .populate("postCover")
      .limit(10)
      .lean({ virtuals: true })
      .sort({ updatedAt: -1 });

    const usersPostIds = usersPosts.map((post) => post._id.toString());
    const following = await followModel.find({ follower: currentUser._id });
    // Check if user has interests
    if (!following || following.length === 0) {
      return {
        props: { initialPosts: [] },
      };
    }
    const followingUserIds = following.map((follow) => follow.following);
    // featured posts
    const posts = await postModel
      .find({
        status: "published",
        author: { $in: followingUserIds },
        _id: { $nin: usersPostIds },
      })
      .populate("topics")
      .populate({ path: "comments" })
      .populate({ path: "likes" })
      .populate({ path: "save", match: { userId: currentUser?._id } })
      .populate("author", "name username")
      .populate("postCover")
      .limit(10)
      .lean({ virtuals: true })
      .sort({ updatedAt: -1 });
    return {
      props: {
        initialPosts: JSON.parse(JSON.stringify(posts)),
        initialUsersPosts: JSON.parse(JSON.stringify(usersPosts)),
      },
    };
  } catch (error) {
    return {
      props: { initialPosts: [], initialUsersPosts: [] },
    };
  }
}
