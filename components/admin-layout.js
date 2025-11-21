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

export default function AdminLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className={"pt-22 pl-3.5"}>
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <Image
                width={150}
                height={140}
                src={"/images/logo.png"}
                className="object-cover w-[140px] h-[180px]"
                alt="logo"
              />
            </div>
          </SidebarHeader>
          <SidebarContent className={"mt-4 space-y-8"}>
            <SidebarMenu className={"space-y-3"}>
              <SidebarMenuItem>
                <Link href="/admin" passHref>
                  <SidebarMenuButton tooltip="Dashboard">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/admin/content" passHref>
                  <SidebarMenuButton tooltip="Content">
                    <FileText />
                    <span>Content</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/admin/users" passHref>
                  <SidebarMenuButton tooltip="Users">
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
                  <SidebarMenuButton tooltip="Settings">
                    <Settings />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <div className="flex items-center gap-2 py-2 px-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="https://picsum.photos/seed/103/100/100"
                      alt="User"
                    />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col text-sm ">
                    <span className="font-semibold">Admin User</span>
                    <span className="text-muted-foreground text-xs">
                      admin@digiblog.com
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
