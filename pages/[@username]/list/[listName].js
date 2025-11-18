import Link from "next/link";
import { Button } from "@/components/ui/button";
import PostCard from "@/components/post-card";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import connectToDB from "@/configs/db";
import { formatDate, verifyToken } from "@/lib/utils";
import usersModel from "@/models/users";
import saveListModel from "@/models/saveList";
import { useAuth } from "@/context/AuthContext";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Lock } from "lucide-react";

export default function Home({ userInfo, saveList }) {
  const { saveItems, userId, createdAt, isPrivate, name } = saveList;
  const { user } = useAuth();

  return (
    <div className="w-8/12 mx-auto px-4">
      <div className=" border-b  my-4 pb-8">
        <div className="flex items-center gap-5 ">
          <Avatar className="h-14 w-14">
            <AvatarImage
              src={userInfo?.profileImage}
              alt={userInfo?.username}
              data-ai-hint={userInfo?.profileImage}
            />
            <AvatarFallback>
              {userInfo?.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-y-1.5">
            <HoverCard>
              <HoverCardTrigger asChild>
                <Link
                  href={`/@${userInfo?.username.toLowerCase()}`}
                  className="flex items-center gap-3 hover:underline transition-all duration-150"
                >
                  <p className="font-semibold text-sm not-prose capitalize">
                    {userInfo?.name}
                  </p>
                </Link>
              </HoverCardTrigger>
              <HoverCardContent>
                <div className="flex items-center justify-between">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={userInfo?.profileImage}
                      alt={userInfo?.username}
                    />
                    <AvatarFallback>
                      {userInfo?.name.charAt(0).toUpperCase()}
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
                    {userInfo?.name}
                  </p>
                  <p className="text-xs leading-[1.7] text-neutral-400">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Dolores praesentium aperiam sequi ad nesciunt odio expedita
                    nam rem, voluptates
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>

            <p className="text-sm text-muted-foreground not-prose flex items-center gap-x-2.5 font-semibold">
              <span>{createdAt && formatDate(createdAt)}</span> ·{" "}
              <span className="flex items-center ">
                {saveItems.length ?? 0} stories{" "}
                {isPrivate && <Lock className="ml-2.5 size-3.5" />}
              </span>
            </p>
          </div>
        </div>
        <h2 className="capitalize mt-11 px-3 font-bold text-4xl">{name} List</h2>
      </div>

      <main>
        <div className="space-y-12">
          {saveItems &&
            saveItems.length>0 &&
            saveItems?.map((post) => (
              <PostCard
                key={post.postId._id}
                id={post.postId._id}
                {...post.postId}
                isSave={user?._id.toString() === userId?._id.toString()}
              />
            ))}
        </div>
      </main>
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
      .lean();

    if (!userInfo) {
      return {
        redirect: {
          destination: "/",
        },
      };
    }
    let saveList = [];

    saveList = await saveListModel
      .findOne({ userId: userInfo._id, name: query.listName })
      .populate({
        path: "saveItems",
        options: {
          sort: { createdAt: -1 },
        },
        populate: [
          {
            path: "postId",
            populate: [{ path: "author" }],
          },
          // { path: "userId" },
        ],
      })
      .populate("userId")
      .lean();

    if (saveList.isPrivate) {
      // No token = redirect immediately
      if (!token) {
        return {
          redirect: {
            destination: `/${query["@username"]}`,
            permanent: false,
          },
        };
      }

      // Verify token with error handling
      try {
        const validToken = verifyToken(token);
        const currentUser = await usersModel
          .findOne({ email: validToken.email }, { _id: 1 })
          .lean();

        // Not owner or user not found = redirect
        if (
          !currentUser ||
          userInfo._id.toString() !== currentUser._id.toString()
        ) {
          return {
            redirect: {
              destination: `/${query["@username"]}`,
              permanent: false,
            },
          };
        }
      } catch (error) {
        return {
          redirect: {
            destination: `/${query["@username"]}`,
            permanent: false,
          },
        };
      }
    }
    return {
      props: {
        userInfo: JSON.parse(JSON.stringify(userInfo)),
        saveList: JSON.parse(JSON.stringify(saveList)),
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        userInfo: [],
        saveList: [],
      },
    };
  }
}
