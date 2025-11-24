import React from "react";
import Link from "next/link";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  Feather,
  Package,
  Shapes,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";

export default function AdminLayout({ children }) {
  const { user } = useAuth();
  const { pathname } = useRouter();
  console.log(pathname);
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className={"pt-22 pl-3.5"}>
          <SidebarContent className={"mt-4 space-y-8"}>
            <SidebarMenu className={"space-y-3 px-2"}>
              <SidebarMenuItem
                className={
                  pathname === "/admin" ? "bg-gray-400/20 rounded-md" : ""
                }
              >
                <Link href="/admin" passHref>
                  <SidebarMenuButton
                    tooltip="Dashboard"
                    className={"[&_svg]:!w-5 [&_svg]:!h-5 text-base"}
                  >
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem
                className={
                  pathname === "/admin/content"
                    ? "bg-gray-400/20 rounded-md"
                    : ""
                }
              >
                <Link href="/admin/content" passHref>
                  <SidebarMenuButton
                    tooltip="Content"
                    className={"[&_svg]:!w-5 [&_svg]:!h-5 text-base"}
                  >
                    <FileText />
                    <span>Content</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem
                className={
                  pathname === "/admin/users" ? "bg-gray-400/20 rounded-md" : ""
                }
              >
                <Link href="/admin/users" passHref>
                  <SidebarMenuButton
                    tooltip="Users"
                    className={"[&_svg]:!w-5 [&_svg]:!h-5 text-base"}
                  >
                    <Users />
                    <span>Users</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/settings" passHref>
                  <SidebarMenuButton tooltip="Settings" className={"[&_svg]:!w-5 [&_svg]:!h-5 text-base"}>
                    <Settings />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <div className="flex items-center gap-2 py-2 px-0 mt-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profileImage} alt={user.name} />
                    <AvatarFallback className={"capitalize"}>
                      {user?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col text-sm gap-y-0.5">
                    <span className="font-semibold">{user.name}</span>
                    <span className="text-muted-foreground text-xs truncate">
                      {user.email}
                    </span>
                  </div>
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1">
          <header className="p-4 border-b flex items-center gap-4">
            <SidebarTrigger />
            <h1 className="text-xl font-headline font-semibold">
              Admin Dashboard
            </h1>
          </header>
          <main className="p-4 md:p-6 lg:p-8 w-full">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
