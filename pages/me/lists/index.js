import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Bookmark, ChevronDown, Lock, MoreHorizontal, X } from "lucide-react";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { ListCard } from "@/components/list-card";
import { verifyRefreshToken, verifyToken } from "@/lib/utils";
import CreateList from "@/components/create-list";
import { useState } from "react";
import connectToDB from "@/configs/db";
import usersModel from "@/models/users";
import { Spinner } from "@/components/ui/spinner";
import ShowMoreBtn from "@/components/show-more-btn";

export default function LibraryPage() {
  const {
    data,
    isLoading,
    refetch,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["library"],
    queryFn: ({ pageParam }) =>
      fetch(`/api/lists?page=${pageParam}&limit=10`).then((res) => res.json()),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const [isShowBanner, setIsShowBanner] = useState(true);
  const allList = data?.pages.flatMap((page) => page.lists) || [];

  return (
    <div className="container mx-auto px-4 max-w-3xl mt-6 ">
      <div className="flex justify-between items-center mb-16">
        <h1 className="text-4xl font-bold font-headline">Your library</h1>
        <CreateList listRefetch={refetch}>
          <Button className="bg-green-600 text-white rounded-full hover:bg-green-700">
            New list
          </Button>
        </CreateList>
      </div>

      <Tabs defaultValue="your-lists">
        <TabsList className="bg-transparent p-0 border-b w-full justify-start rounded-none gap-x-5 ">
          <TabsTrigger
            value="your-lists"
            className="rounded-none border-0 flex-0 text-sm transition-all
  text-muted-foreground hover:text-foreground
  data-[state=active]:shadow-none 
  data-[state=active]:border-b-2 
  data-[state=active]:!border-b-foreground 
  data-[state=active]:text-foreground
  data-[state=active]:bg-transparent"
          >
            Your lists
          </TabsTrigger>
          <TabsTrigger
            value="saved-lists"
            className="rounded-none border-0 flex-0 text-sm transition-all
  text-muted-foreground hover:text-foreground
  data-[state=active]:shadow-none 
  data-[state=active]:border-b-2 
  data-[state=active]:!border-b-foreground 
  data-[state=active]:text-foreground
  data-[state=active]:bg-transparent"
          >
            Saved lists
          </TabsTrigger>
          <TabsTrigger
            value="highlights"
            className="rounded-none border-0 flex-0 text-sm transition-all
  text-muted-foreground hover:text-foreground
  data-[state=active]:shadow-none 
  data-[state=active]:border-b-2 
  data-[state=active]:!border-b-foreground 
  data-[state=active]:text-foreground
  data-[state=active]:bg-transparent"
          >
            Highlights
          </TabsTrigger>
          <TabsTrigger
            value="reading-history"
            className="rounded-none border-0 flex-0 text-sm transition-all
  text-muted-foreground hover:text-foreground
  data-[state=active]:shadow-none 
  data-[state=active]:border-b-2 
  data-[state=active]:!border-b-foreground 
  data-[state=active]:text-foreground
  data-[state=active]:bg-transparent"
          >
            Reading history
          </TabsTrigger>
          <TabsTrigger
            value="responses"
            className="rounded-none border-0 flex-0 text-sm transition-all
  text-muted-foreground hover:text-foreground
  data-[state=active]:shadow-none 
  data-[state=active]:border-b-2 
  data-[state=active]:!border-b-foreground 
  data-[state=active]:text-foreground
  data-[state=active]:bg-transparent"
          >
            Responses
          </TabsTrigger>
        </TabsList>
        <TabsContent value="your-lists" className="mt-6">
          {isShowBanner && (
            <div className="bg-green-600 text-white p-6 rounded-lg flex justify-between items-center relative overflow-hidden mb-8 h-[178px]">
              <div className="z-10">
                <h2 className="font-semibold text-[24px] leading-[1.4] font-headline max-w-[320px]">
                  Create a list to easily organize and share stories
                </h2>
                <CreateList listRefetch={refetch}>
                  <Button
                    variant="secondary"
                    className="mt-5 rounded-full bg-background text-foreground hover:bg-background/80"
                  >
                    Start a list
                  </Button>
                </CreateList>
              </div>
              <div className="absolute right-0 top-0 h-full w-1/2 flex items-center justify-center">
                <div className="w-[283px] h-[283px] bg-green-500 rounded-full opacity-50"></div>
                <div className="absolute w-16 h-16 bg-foreground rounded-full flex items-center justify-center">
                  <Bookmark className="w-7 h-7 text-green-400" />
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-white/70 hover:text-white h-8 w-8 z-10"
                onClick={() => setIsShowBanner(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          )}

          {/* reading */}
          <div className="flex-col gap-y-6 flex">
            {allList.length > 0 &&
              allList.map((post) => (
                <ListCard
                  key={post._id}
                  {...post}
                  author={post.userId}
                  refetch={refetch}
                />
              ))}

            <ShowMoreBtn
              hasNextPage={hasNextPage}
              dataLength={allList.length}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
            />
          </div>
        </TabsContent>
        <TabsContent value="saved-lists" className="mt-6">
          <p className="text-muted-foreground text-center py-12">
            You haven’t saved any lists yet.
          </p>
        </TabsContent>
        <TabsContent value="highlights" className="mt-6">
          <p className="text-muted-foreground text-center py-12">
            You have no highlights.
          </p>
        </TabsContent>
        <TabsContent value="reading-history" className="mt-6">
          <p className="text-muted-foreground text-center py-12">
            Your reading history is empty.
          </p>
        </TabsContent>
        <TabsContent value="responses" className="mt-6">
          <p className="text-muted-foreground text-center py-12">
            You have no responses.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
export async function getServerSideProps(context) {
  const { token, refreshToken } = context.req.cookies;
  await connectToDB();
  if (!token && !refreshToken) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }
  const validToken = verifyToken(token);
  const validRefreshToken = verifyRefreshToken(refreshToken);
  if (!validToken && !validRefreshToken) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }
  const user = await usersModel.findOne({
    email: validToken.email || validRefreshToken.email,
  });
  if (!user) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }
  return { props: {} };
}
