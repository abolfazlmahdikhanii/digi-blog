import FollowTopicBtn from "@/components/FollowTopicBtn";
import PostCard from "@/components/post-card";
import TopicWrapper from "@/components/topic-wrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { WhoToFollowCard } from "@/components/who-to-follow-card";
import connectToDB from "@/configs/db";
import { verifyRefreshToken, verifyToken } from "@/lib/utils";
import postModel from "@/models/posts";
import topicModel from "@/models/topics";
import usersModel from "@/models/users";

import {
  ThumbsUp,
  MessageCircle,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
export default function TopicPage({
  topic,
  totalStory,
  recommendedPosts,
  latestPosts,
  relatedTopics,
  whoFollow,
}) {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <div className="w-full sm:w-11/12 mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
      <Head>
        <title>
          The most insightful stories about {slug || topic.name} - DigiBlog
        </title>
        <meta
          name="description"
          content={`Read stories about ${
            slug || topic.name
          } on DigiBlog. Discover smart, unique perspectives on Hh and the topics that matter most to you like Crypto, Ethereum, Staking Rewards, Cdc, Rewards, Passive Income, Blockchain, Who, BlackLivesMatter, and more.`}
        />
      </Head>
      {/* Related Topics */}
      <div className="flex overflow-x-auto whitespace-nowrap gap-2 sm:gap-3 mb-8 sm:mb-12 md:mb-16 -mx-3 sm:-mx-4 px-3 sm:px-4 pb-3 sm:pb-4 md:pb-5 border-b scrollbar-hide">
        {relatedTopics.map((related, index) => (
          <Button
            key={related._id}
            variant={related.name === slug ? "outline" : "secondary"}
            className="rounded-full px-3 sm:px-4 md:px-5.5 py-2 sm:py-2.5 capitalize min-h-9 sm:min-h-10 text-xs sm:text-sm flex-shrink-0"
            asChild
          >
            <Link href={`/tags/${related.slug}`}>{related.name}</Link>
          </Button>
        ))}
      </div>

      {/* Topic Header */}
      <div className="text-center mb-12 sm:mb-16 md:mb-24 px-2 sm:px-0">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-headline capitalize leading-tight">
          {topic?.name || slug}
        </h1>
        <p className="text-muted-foreground mt-3 sm:mt-4 md:mt-6 text-base sm:text-lg">
          Topic · {totalStory} {totalStory === 1 ? "story" : "stories"}
        </p>
        <div className="mt-4 sm:mt-5 md:mt-7">
          <FollowTopicBtn slug={slug || topic?.slug} />
        </div>
      </div>

      {/* Recommended Stories */}
      {recommendedPosts.length > 0 && (
        <section className="mb-8 sm:mb-12 md:mb-16 border-b pb-10 sm:pb-14 md:pb-20">
          <h2 className="text-xl sm:text-2xl font-bold font-headline mb-4 sm:mb-6 md:mb-8">
            Recommended stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-4 sm:mb-6 md:mb-8">
            {recommendedPosts.slice(0, 2).map((story) => (
              <PostCard key={story._id} id={story._id} {...story} isCol />
            ))}
          </div>
          {recommendedPosts.length > 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {recommendedPosts.slice(2, 5).map((story) => (
                <PostCard key={story._id} id={story._id} {...story} isCol />
              ))}
            </div>
          )}
          <div className="mt-6 sm:mt-8 md:mt-12 text-center sm:text-left">
            <Button
              variant="outline"
              className="rounded-full min-h-10 px-4 sm:px-6 text-sm w-full sm:w-auto"
              asChild
            >
              <Link href={`/tags/${slug}/recommended`}>
                See more recommended stories
              </Link>
            </Button>
          </div>
        </section>
      )}

      {/* Who to Follow */}
      {whoFollow && whoFollow.length > 0 && (
        <section className="mb-8 sm:mb-12 md:mb-16 border-b pb-10 sm:pb-14 md:pb-20">
          <h2 className="text-xl sm:text-2xl font-bold font-headline mb-4 sm:mb-6 md:mb-8">
            Who to follow
          </h2>
          <Carousel
            opts={{
              align: "start",
              slidesToScroll: 1,
            }}
          >
            <CarouselContent className="-ml-2 sm:-ml-3 md:-ml-4">
              {whoFollow.map((user) => (
                <CarouselItem
                  key={user._id}
                  className="pl-2 sm:pl-3 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <WhoToFollowCard {...user} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
          <div className="mt-6 sm:mt-8 md:mt-12 text-center sm:text-left">
            <Button
              variant="outline"
              className="rounded-full min-h-10 px-4 sm:px-6 text-sm w-full sm:w-auto"
              asChild
            >
              <Link href={`/tags/${slug}/author`}>See more</Link>
            </Button>
          </div>
        </section>
      )}

      {/* Latest Stories */}
      {latestPosts.length > 0 && (
        <section>
          <TopicWrapper title={"last stories"}>
            {latestPosts.map((story) => (
              <PostCard key={story._id} id={story._id} {...story} />
            ))}
          </TopicWrapper>
          <div className="text-center mt-10 sm:mt-14 md:mt-20">
            <Button
              variant="outline"
              className="rounded-full min-h-10 px-4 sm:px-6 text-sm w-full sm:w-auto max-w-xs sm:max-w-none"
              asChild
            >
              <Link href={`/tags/${slug}/archive`}>See more stories</Link>
            </Button>
          </div>
        </section>
      )}

      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

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

      .sort({ createdAt: -1 });

    // Calculate engagement for sorting
    const postsWithEngagement = allPosts.map((post) => ({
      ...post.toObject(),
      likesCount: post.likes?.length || 0,
      commentsCount: post.comments?.length || 0,
      totalEngagement:
        (post.likes?.length || 0) * 2 + (post.comments?.length || 0) * 3,
    }));

    // Get latest posts (newest first)
    const latestPosts = postsWithEngagement.slice(0, 10);

    const lastPostId = new Set(latestPosts.map((item) => item._id.toString()));
    // Get recommended posts (sorted by engagement + recency)
    const recommendedPosts = postsWithEngagement
      .filter((post) => !lastPostId.has(post._id.toString()))
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
      .slice(0, 8);

    // Get related topics (last 10 topics, excluding current topic)
    const relatedTopics = await topicModel
      .find({ _id: { $ne: topic._id } })
      .sort({ createdAt: -1 })
      .limit(10);

    const whoToFollow = await usersModel
      .find({
        interests: { $in: [topic._id] },
      })
      .limit(10);

    return {
      props: {
        recommendedPosts: JSON.parse(JSON.stringify(recommendedPosts)),
        latestPosts: JSON.parse(JSON.stringify(latestPosts)),
        relatedTopics: JSON.parse(JSON.stringify([topic, ...relatedTopics])),
        topic: JSON.parse(JSON.stringify(topic)),
        totalStory: allPosts.length,
        whoFollow: JSON.parse(JSON.stringify(whoToFollow)),
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        recommendedPosts: [],
        latestPosts: [],
        relatedTopics: [],
        whoFollow: [],
      },
    };
  }
}
