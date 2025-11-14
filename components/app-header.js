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

const Logo = () => (
  <Link href="/" className="flex items-center gap-2">
    <Feather className="h-6 w-6 text-primary" />
    <span className="font-headline text-xl font-bold tracking-tight">
      EchoJournal
    </span>
  </Link>
);

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/recommendations", label: "Recommendations" },
  { href: "/moderation", label: "Moderation" },
  { href: "/notifications", label: "Notifications" },
  { href: "/admin", label: "Admin" },
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
      <Button variant="outline" size="icon" className="shrink-0 md:hidden">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle navigation menu</span>
      </Button>
    </SheetTrigger>
    <SheetContent side="left">
      <nav className="grid gap-6 text-lg font-medium">
        <Logo />
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-4 text-muted-foreground hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
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

    if (value.trim().length >= 2) {
      debouncedSearch(value);
      setIsOpenPreview(true);
    } else {
      setSearchResults(null);
      setIsOpenPreview(false);
    }
  };
  const submitSearchHandler = (e) => {
    e.preventDefault();
    router.push(`/search?q=${searchQuery}`);
    setIsOpenPreview(false);
  };
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ">
      <div className="container px-8 flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <MobileNav />
          <Logo />
          <form className="hidden md:flex ml-4" onSubmit={submitSearchHandler}>
            <Popover open={isOpenPreview}>
              <PopoverTrigger asChild>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search..."
                    className="w-full rounded-full bg-secondary pl-9.5"
                    value={searchQuery}
                    onChange={handleInputChange}
                    onBlur={() => setIsOpenPreview(false)}
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent
                className="w-[316px] py-[30px] [&>span]:!left-9"
                sideOffset={5}
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <SearchPreview query={searchQuery} results={searchResults} />
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
