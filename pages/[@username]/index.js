import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostCard from "@/components/post-card";
import { Mail, UserPlus, MoreHorizontal, Bookmark } from "lucide-react";
import Link from "next/link";
import { UserListItem } from "@/components/user-list-item";
import usersModel from "@/models/users";
import { capitalize } from "lodash";
import connectToDB from "@/configs/db";
import saveListModel from "@/models/saveList";
import cookie from "cookie";
import { formatNumber, verifyToken } from "@/lib/utils";
import { ListCard } from "@/components/list-card";
import { useState } from "react";
import HoverProfile from "@/components/hover-profile";
import { useRouter } from "next/router";
import useFollow from "@/hooks/useFollow";
import followModel from "@/models/follows";
import { redirect } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import FollowBtn from "@/components/FollowBtn";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Head from "next/head";

export default function AuthorProfilePage({
  userInfo,
  saveList,
  initialFollower,
  initialFollowing,
}) {
  const { query } = useRouter();
  const { user } = useAuth();
  const username = query["@username"]?.replace("@", "");
  const { follower, following } = useFollow(username, {
    followerData: initialFollower,
    followingData: initialFollowing,
  });

  return (
    <div>
      <Head>
        <title>{user?.name} on DigiBlog</title>
        <meta
          name="description"
          content={`Read writing from ${user?.name} on DigiBlog.`}
        />
      </Head>
      <div className="relative h-48 md:h-64 w-full">
        <Image
          src={"/images/profile-bg.jpg"}
          alt={"profile background"}
          fill
          priority
        />
      </div>
      <div className=" mx-auto px-4 mt-3">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8 w-10/12 mx-auto">
            <div className="flex items-end gap-4 mb-4">
              <Avatar className="w-24 h-24 md:w-30 md:h-30 border-4 border-background ring-2 ring-primary">
                <AvatarImage
                  src={userInfo && userInfo?.profileImage}
                  alt={userInfo?.name}
                />
                <AvatarFallback className={"capitalize text-2xl"}>
                  {userInfo?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="font-headline text-2xl md:text-3xl font-bold tracking-tight capitalize">
                  {userInfo?.name}
                </h1>
                <div className="flex items-center gap-4 text-muted-foreground my-2.5">
                  <Link
                    href={`/@${username}/followers`}
                    className="hover:underline"
                  >
                    {follower?.follower &&
                      formatNumber(follower.follower.length)}{" "}
                    Followers
                  </Link>
                  <span>·</span>
                  <Link
                    href={`/@${username}/following`}
                    className="hover:underline"
                  >
                    {following?.following &&
                      formatNumber(following.following.length)}{" "}
                    Following
                  </Link>
                </div>
              </div>
            </div>

            <Tabs defaultValue="home" className="mt-8">
              <div className="flex justify-between items-center border-b">
                <TabsList className="bg-transparent p-0 border-b w-full justify-start rounded-none gap-x-5 ">
                  <TabsTrigger
                    value="home"
                    className="rounded-none border-0 flex-0 text-sm transition-all
  text-muted-foreground hover:text-foreground
  data-[state=active]:shadow-none 
  data-[state=active]:border-b-2 
  data-[state=active]:!border-b-foreground 
  data-[state=active]:text-foreground
  data-[state=active]:bg-transparent"
                  >
                    Home
                  </TabsTrigger>
                  <TabsTrigger
                    value="about"
                    className="rounded-none border-0 flex-0 text-sm transition-all
  text-muted-foreground hover:text-foreground
  data-[state=active]:shadow-none 
  data-[state=active]:border-b-2 
  data-[state=active]:!border-b-foreground 
  data-[state=active]:text-foreground
  data-[state=active]:bg-transparent"
                  >
                    About
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="home" className="mt-6">
                <div className="space-y-8">
                  {saveList?.map((post) => (
                    <ListCard key={post._id} {...post} author={post?.userId} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="about" id="about" className="mt-6">
                {!userInfo.bio ? (
                  <div className="prose prose-lg dark:prose-invert max-w-none  rounded-lg">
                    <p>{userInfo.bio}</p>
                  </div>
                ) : (
                  <div className="flex flex-col justify-center items-center bg-neutral-900 py-20 rounded-lg">
                    <p className="text-lg font-semibold">
                      Tell the world about yourself
                    </p>
                    <p className="text-sm text-center mt-5 mb-7 max-w-md leading-[1.7]">
                      Here’s where you can share more about yourself: your
                      history, work experience, accomplishments, interests,
                      dreams, and more. You can even add images and use rich
                      text to personalize your bio.
                    </p>
                    <Button
                      variant={"outline"}
                      className={"min-h-10  rounded-full px-6"}
                      asChild
                    >
                      <Link href={"/settings"}>Get Started</Link>
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
          <aside className="hidden lg:block col-span-4 space-y-8  col-start-9 -col-end-1 sticky top-[40px]">
            <div className="p-4 rounded-lg bg-card border ">
              <Avatar className="w-16 h-16 mb-4">
                <AvatarImage
                  src={userInfo && userInfo?.profileImage}
                  alt={userInfo.name}
                />
                <AvatarFallback className={"capitalize text-lg"}>
                  {userInfo?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <h2 className="font-bold text-lg font-headline">
                {userInfo?.name}
              </h2>
              <div className="mt-5 mb-7">
                {user && username === user.username ? (
                  <p className="text-[13px]   text-blue-500 cursor-pointer">
                    Edit profile
                  </p>
                ) : (
                  <FollowBtn username={username} />
                )}
              </div>
              {follower && follower?.follower?.length > 0 && (
                <div className="">
                  <p className="font-[600] text-base">Following</p>
                  <div className="mt-5 space-y-2.5">
                    {follower?.follower?.slice(0, 5).map((item) => (
                      <HoverProfile key={item._id} author={item.follower} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  await connectToDB();
  try {
    const query = context.query;
    const { token } = context.req.cookies;

    const decodeUsernameUrl = decodeURIComponent(query["@username"]).replace(
      "@",
      ""
    );

    const userInfo = await usersModel
      .findOne({ username: decodeUsernameUrl })
      .populate({
        path: "posts",
        populate: [{ path: "comments" }],
      })
      // .populate("author")
      .lean();

    if (!userInfo) {
      return {
        redirect: {
          destination: "/",
        },
      };
    }

    const follower = await followModel
      .find({
        following: userInfo._id,
      })
      .populate("follower")
      .lean();
    const following = await followModel
      .find({
        follower: userInfo._id,
      })
      .populate("following")
      .lean();
    let saveList = [];

    if (token) {
      const validToken = verifyToken(token);
      const currentUser = await usersModel.findOne({ email: validToken.email });
      if (userInfo._id.toString() === currentUser._id.toString()) {
        saveList = await saveListModel
          .find({ userId: userInfo._id })
          .populate({
            path: "saveItems",
            options: {
              limit: 3,
              sort: { createdAt: -1 },
            },
            populate: [
              {
                path: "postId",
                select: "postCover",
                populate: {
                  path: "postCover", // assuming postCover is a reference to the image table
                  select: "imageUrl", // select the fields you need from the image table
                },
              },
              // { path: "userId" },
            ],
          })
          .populate("userId")
          .lean();
      }
    } else {
      saveList = await saveListModel
        .find({ userId: userInfo._id, isPrivate: false })
        .populate({
          path: "saveItems",
          options: {
            limit: 3,
            sort: { createdAt: -1 },
          },
          populate: [
            {
              path: "postId",
              select: "postCover", // or whatever field references the image
              populate: {
                path: "postCover", // assuming postCover is a reference to the image table
           
                select: "imageUrl", // select the fields you need from the image table
              },
            },
          ],
        })
        .populate("userId")
        .lean();
    }

    return {
      props: {
        userInfo: JSON.parse(JSON.stringify(userInfo)),
        saveList: JSON.parse(JSON.stringify(saveList)),
        initialFollower: JSON.parse(JSON.stringify(follower)),
        initialFollowing: JSON.parse(JSON.stringify(following)),
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/500",
      },
    };
  }
}
