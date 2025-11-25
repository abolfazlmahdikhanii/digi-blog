import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, ChevronDown, ChevronRight, Link, Trash2 } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import NotificationItem from "@/components/notification-item";
import { Spinner } from "@/components/ui/spinner";
import ShowMoreBtn from "@/components/show-more-btn";
import { toast } from "sonner";
import Head from "next/head";

export default function NotificationsPage() {
  const {
    data,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["notify"],
    queryFn: async ({ pageParam }) => {
      const res = await fetch(`/api/notification?page=${pageParam}&limit=15`);
      if (!res.ok) throw new Error("Failed to fetch stories");
      return res.json();
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const readNotification = async (id) => {
    try {
      const res = await fetch(`/api/notification/${id}`, {
        method: "PUT",
      });

      if (!res.ok) {
        throw new Error("Failed to read notification");
      }

      toast.success("notification read successfully :)");

      refetch();
    } catch (error) {
      toast.error("Failed to read notification");
    }
  };

  const allNotification =
    data?.pages.flatMap((page) => page.notifications) || [];

  return (
    <div className="w-11/12 mx-auto px-4 mt-6 ">
       <Head>
              <title>Notifications-DigiBlog</title>
            </Head>
      <h1 className="text-4xl font-bold font-headline mb-12">Notifications</h1>
      <Tabs defaultValue="all">
        <TabsList className="bg-transparent p-0 border-b w-full justify-start rounded-none gap-x-3">
          <TabsTrigger
            value="all"
            className="rounded-none border-0 flex-0 text-sm transition-all
  text-muted-foreground hover:text-foreground
  data-[state=active]:shadow-none 
  data-[state=active]:border-b-2 
  data-[state=active]:!border-b-foreground 
  data-[state=active]:text-foreground
  data-[state=active]:bg-transparent"
          >
            All
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
        <TabsContent value="all" className="mt-6">
          {allNotification.length > 0 ? (
            <div className="flex flex-col gap-y-4">
              {allNotification.map((notify) => (
                <NotificationItem
                  key={notify._id}
                  {...notify}
                  isLoading={isLoading}
                  onRead={() => readNotification(notify._id)}
                />
              ))}

              <ShowMoreBtn
                hasNextPage={hasNextPage}
                dataLength={allNotification.length}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
              />
            </div>
          ) : (
            <p className="text-muted-foreground">You're all caught up.</p>
          )}
        </TabsContent>
        <TabsContent value="responses" className="mt-6">
          <p className="text-muted-foreground">You have no responses yet.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
