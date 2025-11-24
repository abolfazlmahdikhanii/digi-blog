import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export function RightSidebar() {
  const { data, isLoading } = useQuery({
    queryKey: ["sidebar-info"],
    queryFn: () => fetch("/api/sidebar-info").then((res) => res.json()),
  });

  return (
    <aside className="hidden lg:block w-[370px] border-l pl-9 pr-4 py-8 space-y-8">
      <section>
        <h3 className="font-bold mb-4 font-headline">Recommended topics</h3>
        <div className="flex flex-wrap gap-2">
          {data &&
            data?.topics.map((topic) => (
              <Link href={`/tags/${topic.slug}`} key={topic._id}>
                <Badge
                  
                  variant="secondary"
                  className="rounded-full px-3 sm:px-4 md:px-5.5 py-2 sm:py-2.5 capitalize  text-xs sm:text-sm flex-shrink-0"
                  
                >
                  {topic.name}
                </Badge>
              </Link>
            ))}
        </div>
      </section>
      <section>
        {data && data.whoFollow?.length > 0 ? (
          <>
            <h3 className="font-bold mb-4 font-headline">Who to follow</h3>
            <div className="space-y-4.5">
              {data.whoFollow.map((userInfo) => (
                <Button
                  key={userInfo?.following._id}
                  variant="ghost"
                  className="justify-start h-auto mb-12"
                  asChild
                >
                  <Link href={`/@${userInfo?.follower?.username}`}>
                    <Avatar className="h-6 w-6 mr-1">
                      <AvatarImage
                        src={userInfo?.follower.profileImage}
                        alt={userInfo?.follower.name}
                      />
                      <AvatarFallback className={"capitalize"}>
                        {userInfo?.follower?.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate">
                      {userInfo?.following?.name}
                    </span>
                  </Link>
                </Button>
              ))}
            </div>
          </>
        ) : null}
      </section>
    </aside>
  );
}
