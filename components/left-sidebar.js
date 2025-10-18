
import React from "react";
import Link from "next/link";
import { Home, Library, User, BarChart2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "#", icon: Library, label: "Library" },
  { href: "/profile/johndoe", icon: User, label: "Profile" },
  { href: "#", icon: BarChart2, label: "Stories" },
  { href: "#", icon: BarChart2, label: "Stats" },
];

const following = [
  { id: "f1", name: "JavaScript in Plain English", avatar: "" },
  { id: "f2", name: "fatfish", avatar: "" },
  { id: "f3", name: "Rana Adnan", avatar: "" },
  { id: "f4", name: "Ahmed Hashesh", avatar: "" },
];
const LeftSidebar = () => {
  return (
    <aside className="hidden md:block min-w-72 max-w-72 border-r p-4 py-8">
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            className="justify-start text-base"
            asChild
          >
            <Link href={item.href}>
              <item.icon className="mr-4 h-6 w-6" />
              {item.label}
            </Link>
          </Button>
        ))}
      </nav>
      <div className="mt-8">
        <h3 className="font-semibold text-sm mb-4 px-4">Following</h3>
        <nav className="flex flex-col gap-2">
          {following.map((user) => (
            <Button
              key={user.id}
              variant="ghost"
              className="justify-start h-auto"
              asChild
            >
              <Link href="#">
                <Avatar className="h-6 w-6 mr-3">
                  <AvatarImage
                    src={user.avatar.imageUrl}
                    alt={user.name}
                    data-ai-hint={user.avatar.imageHint}
                  />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="truncate">{user.name}</span>
              </Link>
            </Button>
          ))}
        </nav>
      </div>
      <div className="mt-8">
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
