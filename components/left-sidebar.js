import React from "react";
import Link from "next/link";
import {
  Home,
  Library,
  User,
  BarChart2,
  Search,
  Notebook,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import useFollow from "@/hooks/useFollow";
const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/me/lists", icon: Library, label: "Library" },
  { href: "/@", icon: User, label: "Profile" },
  { href: "/me/stories", icon: FileText, label: "Stories" },
  // { href: "#", icon: BarChart2, label: "Stats" },
];

const LeftSidebar = () => {
  const { user } = useAuth();
  const { follower } = useFollow(user?.username);
  const router = useRouter();

  return (
    <aside className="hidden md:block min-w-72 max-w-72 border-r p-4 py-8">
      <nav className="flex flex-col gap-1.5">
        {navItems.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            className={`justify-start text-lg font-normal [&>svg]:!w-5 [&>svg]:!h-5 ${
              item.label !== "Home" && item.label !== "Profile"
                ? router.pathname.startsWith(item.href)
                  ? "text-neutral-100"
                  : "text-neutral-400"
                : router.pathname === item.href ||
                  (item.label === "Profile" && router.pathname.includes("@"))
                ? "text-neutral-100"
                : "text-neutral-400"
            }`}
            asChild
          >
            <Link
              href={
                item.label !== "Profile"
                  ? item.href
                  : user
                  ? `${item.href}${user?.username}`
                  : "#"
              }
            >
              <item.icon className="mr-4 h-8 w-8" />
              {item.label}
            </Link>
          </Button>
        ))}
      </nav>
      <div className="mt-8">
        <h3 className="font-semibold text-base mb-4 px-4">Following</h3>
        <nav className="flex flex-col gap-2 ">
          {follower?.follower && follower?.follower.length > 0 ? (
            follower.follower.map((userInfo) => (
              <Button
                key={userInfo?.follower._id}
                variant="ghost"
                className="justify-start h-auto mb-12"
                asChild
              >
                <Link href={`/@${userInfo?.follower?.username}`}>
                  <Avatar className="h-6 w-6 mr-1">
                    <AvatarImage src={userInfo?.follower.profileImage} alt={userInfo?.follower.name} />
                    <AvatarFallback className={"capitalize"}>
                      {userInfo?.follower?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{userInfo?.follower?.name}</span>
                </Link>
              </Button>
            ))
          ) : (
          null
          )}
        </nav>
      </div>
      <div className="">
        <Button variant="ghost" className="justify-start w-full" asChild>
          <Link href="#">
            <Search className="mr-4 h-6 w-6" />
            <span>Find writers to follow.</span>
          </Link>
        </Button>
        <Button variant="link" className="text-muted-foreground" asChild>
          <Link href="#">See suggestions</Link>
        </Button>
      </div>
    </aside>
  );
};

export default LeftSidebar;
