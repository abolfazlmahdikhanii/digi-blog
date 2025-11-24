import Link from "next/link";
import {
  Menu,
  Search,
  BookOpen,
  Bell,
  Feather,
  User,
  Settings,
  LogOut,
  PenSquare,
  UserCircle2,
  Home,
  Library,
  FileText,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { capitalize, debounce } from "lodash";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";
import { useCallback, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";

import {
  Popover,
  PopoverAnchor,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { SearchPreview } from "./search-preview";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useIsMobile } from "@/hooks/use-mobile";

const Logo = () => (
  <Link href="/" className="flex items-center gap-2 overflow-hidden">
    <Image
      width={150}
      height={140}
      src={"/images/logo.png"}
      className="object-cover w-[140px] h-[180px]"
      alt="logo"
    />
  </Link>
);

const navLinks = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/me/lists", icon: Library, label: "Library" },
  { href: "/@", icon: User, label: "Profile" },
  { href: "/me/stories", icon: FileText, label: "Stories" },
  // { href: "#", icon: BarChart2, label: "Stats" },
];

const UserMenu = ({ email, name, profileImage = "", logOut }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="relative h-9 w-9 rounded-full">
        <Avatar className="h-9 w-9">
          <AvatarImage src={profileImage} alt="User" />
          <AvatarFallback>{name?.toUpperCase().charAt(0)}</AvatarFallback>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56" align="end" forceMount>
      <DropdownMenuLabel className="font-normal">
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium leading-none">{capitalize(name)}</p>
          <p className="text-xs leading-none text-muted-foreground mt-1">
            {email}
          </p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <Link href="/profile/johndoe">
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
        </Link>
        <Link href="/editor">
          <DropdownMenuItem>
            <PenSquare className="mr-2 h-4 w-4" />
            <span>New Post</span>
          </DropdownMenuItem>
        </Link>
        <Link href="/settings">
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </Link>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={logOut}>
        <LogOut className="mr-2 h-4 w-4" />
        <span>Log out</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const MobileNav = () => (
  <Sheet>
    <SheetTrigger asChild>
      <Button variant="ghost" size="icon" className="shrink-0 md:hidden">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle navigation menu</span>
      </Button>
    </SheetTrigger>
    <SheetContent side="left">
      <nav className="grid text-lg font-medium">
        <Logo />
        <div className={"px-5 grid gap-6 text-lg font-medium"}>
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex items-center gap-4 text-muted-foreground hover:text-foreground"
            >
              <link.icon className="mr-4 h-6 w-6" />
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </SheetContent>
  </Sheet>
);

export default function AppHeader() {
  const { user, logoutHandler } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isOpenPreview, setIsOpenPreview] = useState(false);
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const router = useRouter();
  const isMobile = useIsMobile();
  const searchMutation = useMutation({
    mutationFn: async (term) => {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchQuery: term }),
      });

      if (!response.ok) {
        throw new Error("Search failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      setSearchResults(data.data);
    },
    onError: (error) => {
      console.error("Search error:", error);
      setSearchResults([]);
    },
  });
  useEffect(() => {
    if (router.pathname.startsWith("/search") && query) setSearchQuery(query);
    else {
      setSearchQuery("");
    }
  }, [query, router.pathname]);

  const debouncedSearch = useCallback(
    debounce((term) => {
      if (term.trim().length >= 2) {
        searchMutation.mutate(term.trim());
      } else {
        setSearchResults(null);
      }
    }, 400),
    []
  );
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (!isMobile) {
      if (value.trim().length >= 2) {
        debouncedSearch(value);
        setIsOpenPreview(true);
      } else {
        setSearchResults(null);
        setIsOpenPreview(false);
      }
    } else {
      debouncedSearch(value);
      setIsOpenPreview(true);
    }
  };
  const submitSearchHandler = (e) => {
    e.preventDefault();
    router.push(`/search?q=${searchQuery}`);
    setIsOpenPreview(false);
  };
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ">
      <div className="xl:container px-3 pt-5 md:pt-0 md:px-8 flex h-20 md:h-16 items-center justify-between gap-4">
        <div className="flex items-center md:gap-4  w-[80%] md:w-[unset] justify-between md:justify-[unset]">
          <div className="flex items-center">
            <MobileNav />
            <Logo />
          </div>
          <form className="flex ml-4 " onSubmit={submitSearchHandler}>
            <Popover open={isOpenPreview}>
              <PopoverTrigger asChild>
                <div className="relative md:w-64 ">
                  <Search
                    className="md:absolute left-3 top-2.5 h-4 w-4 text-muted-foreground cursor-pointer"
                    onClick={() =>
                      isMobile ? setIsOpenPreview((prev) => !prev) : null
                    }
                  />
                  <Input
                    type="text"
                    placeholder="Search..."
                    className="w-full rounded-full bg-secondary pl-9.5 hidden md:flex"
                    value={searchQuery}
                    onChange={handleInputChange}
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent
                className="md:w-[316px] w-screen h-screen md:h-[unset] md:py-[30px] md:[&>span]:!left-9 z-20"
                sideOffset={5}
                onOpenAutoFocus={(e) => e.preventDefault()}
                onFocusOutside={() => setIsOpenPreview(false)}
                onInteractOutside={() => setIsOpenPreview(false)}
              >
                <div className="md:hidden mt-4 relative mb-5 md:mb-0 ">
                  <Input
                    type="text"
                    placeholder="Search..."
                    className="w-full rounded-lg bg-secondary pr-9.5 min-h-10 pl-4 "
                    value={searchQuery}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        submitSearchHandler(e);
                      }
                    }}
                  />
                  <button
                    className={
                      "rounded-full absolute right-3 top-2 w-6 h-6 bg-primary grid place-items-center"
                    }
                    size={"icon"}
                    onClick={submitSearchHandler}
                  >
                    <ArrowRight size={13} />
                  </button>
                </div>
                <SearchPreview
                  query={searchQuery}
                  results={searchResults}
                  onClose={() => setIsOpenPreview(false)}
                />
                <PopoverArrow />
              </PopoverContent>
            </Popover>
          </form>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/editor">
            <Button variant="ghost" className="hidden md:flex">
              <PenSquare className="mr-2 h-4 w-4" />
              Write
            </Button>
          </Link>
          <Link href="/notifications">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Bell className="h-5 w-5" />
            </Button>
          </Link>
          {user ? (
            <UserMenu {...user} logOut={logoutHandler} />
          ) : (
            <Link href="/auth">
              <Button variant="outline" className="md:flex">
                <UserCircle2 className="mr-2 h-4 w-4" />
                Account
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
