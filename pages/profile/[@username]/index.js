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

export default function AuthorProfilePage({ userInfo }) {
  return (
    <div>
      <div className="relative h-48 md:h-64 w-full">
        <Image
          src={"/images/profile-bg.jpg"}
          alt={"profile background"}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="container mx-auto px-4 mt-3">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8 w-10/12 mx-auto">
            <div className="flex items-end gap-4 mb-4">
              <Avatar className="w-24 h-24 md:w-30 md:h-30 border-4 border-background ring-2 ring-primary">
                <AvatarImage src={userInfo.profileImage} alt={userInfo.name} />
                <AvatarFallback>{userInfo.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="font-headline text-2xl md:text-3xl font-bold tracking-tight">
                  {capitalize(userInfo.name)}
                </h1>
                <div className="flex items-center gap-4 text-muted-foreground my-2.5">
                  <Link href="#followers" className="hover:underline">
                    2k Followers
                  </Link>
                  <span>·</span>
                  <Link href="#following" className="hover:underline">
                    11 Following
                  </Link>
                </div>
              </div>
            </div>

            <Tabs defaultValue="home" className="mt-8">
              <div className="flex justify-between items-center border-b">
                <TabsList className="bg-transparent p-0 border-b w-full justify-start rounded-none gap-x-5 ">
                  <TabsTrigger
                    value="home"
                    className="rounded-none data-[state=active]:shadow-none data-[state=active]:border-b-1 border-0  dark:data-[state=active]:!border-neutral-200 flex-0 text-base "
                  >
                    Home
                  </TabsTrigger>
                  <TabsTrigger
                    value="about"
                    className="rounded-none data-[state=active]:shadow-none data-[state=active]:border-b-1 border-0 w-fit dark:data-[state=active]:!border-neutral-200 flex-0 text-base"
                  >
                    About
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="home" className="mt-6">
                <h3 className="font-bold mb-4 font-headline">Writing list</h3>

                <div className="space-y-8">
                  {userInfo?.posts?.map((post) => (
                    <PostCard
                      key={post.id}
                      {...post}
                      author={userInfo}
                      comments={post?.comments&&post?.comments.length}
                    />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="about" id="about" className="mt-6">
                <div className="prose prose-lg dark:prose-invert max-w-none bg-card p-8 rounded-lg">
                  <h2 className="font-headline">About {userInfo.name}</h2>
                  <p>
                    {userInfo.bio} Lorem ipsum dolor sit amet, consectetur
                    adipiscing elit. Sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                    commodo consequat.
                  </p>
                  <p>
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                  </p>
                </div>
              </TabsContent>
              {/* <TabsContent value="followers" id="followers" className="mt-6">
                <div className="space-y-4">
                  {author.followersList.map((user) => (
                    <UserListItem key={user.id} {...user} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="following" id="following" className="mt-6">
                <div className="space-y-4">
                  {author.followingList.map((user) => (
                    <UserListItem key={user.id} {...user} />
                  ))}
                </div>
              </TabsContent> */}
            </Tabs>
          </div>
          <aside className="hidden lg:block col-span-4 space-y-8  col-start-9 -col-end-1 sticky top-[40px]">
            <div className="p-4 rounded-lg bg-card border">
              <Avatar className="w-16 h-16 mb-4">
                <AvatarImage src={userInfo.profileImage} alt={userInfo.name} />
                <AvatarFallback>{userInfo?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="font-bold text-lg font-headline">
                {userInfo.name}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">2K Followers</p>
              <p className="text-sm text-foreground/80 mt-4 mb-6">
                {userInfo.bio}
              </p>
              <div className="flex items-center gap-2">
                <Button className="flex-1">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Follow
                </Button>
                <Button variant="outline" size="icon">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
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
    const decodeUsernameUrl = decodeURIComponent(query["@username"]).replace(
      "@",
      ""
    );

    const userInfo = await usersModel
      .findOne({ username: decodeUsernameUrl })
      .populate({
        path: "posts",
        populate: [{ path: "category" }, { path: "comments" }],
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

    return {
      props: {
        userInfo: JSON.parse(JSON.stringify(userInfo)),
      },
    };
  } catch (error) {
    return {
      props: {
        userInfo: [],
      },
    };
  }
}
