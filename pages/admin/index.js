"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Users, FileText, MessageSquare, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import AdminLayout from "@/components/admin-layout";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import { relativeTimeFormat } from "@/lib/utils";

export default function AdminDashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-info"],
    queryFn: () => fetch("/api/admin/info").then((res) => res.json()),
  });
  if (isLoading) {
    return (
      <div className="fixed top-1/2 left-1/2 -translate-1/2">
        <Spinner className={"w-8 h-8"}/>
      </div>
    );
  }
  const { stats, chartData, recentPosts } = data;

  return (
    <AdminLayout>
      <div className="space-y-6 sm:space-y-8 py-4 sm:p-6 lg:p-8">
        {/* Stats Cards - Responsive Grid */}
        <div className="grid gap-3 sm:gap-4 grid-cols-1 xs:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {stats?.totalUsers ? stats.totalUsers.count : 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats?.totalUsers
                  ? stats.totalUsers.change
                  : " +0% from last month "}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {" "}
                {stats?.totalPosts ? stats.totalPosts.count : 0}
              </div>
              <p className="text-xs text-muted-foreground  mt-1">
                {stats?.totalPosts
                  ? stats.totalPosts.change
                  : " +0% from last month "}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Comments
              </CardTitle>
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {" "}
                {stats?.totalComments ? stats.totalComments.count : 0}
              </div>
              <p className="text-xs text-muted-foreground  mt-1">
                {stats?.totalComments
                  ? stats.totalComments.change
                  : " +0% from last month "}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">1.2M</div>
              <p className="text-xs text-muted-foreground  mt-1">
                +52k this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Chart and Table - Responsive Grid */}
        <div className="grid gap-6 sm:gap-8 grid-cols-1 lg:grid-cols-2">
          {/* Chart Card */}
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-lg sm:text-xl">
                New User Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] sm:h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="name"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickMargin={8}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickMargin={8}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar
                      dataKey="users"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Table Card */}
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-lg sm:text-xl">
                Recent Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Desktop Table */}
              <div className="hidden sm:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentPosts &&
                      recentPosts.length > 0 &&
                      recentPosts.map((post) => (
                        <TableRow key={post._id}>
                          <TableCell className="font-medium truncate">
                            {post.title}
                          </TableCell>
                          <TableCell className={"truncate"}>
                            {post.author.username}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                post.status === "published"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {post.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {relativeTimeFormat(post.createdAt)}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="sm:hidden space-y-4">
                {recentPosts.map((post) => (
                  <div
                    key={post._id}
                    className="border rounded-lg p-4 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium text-sm">{post.title}</h3>
                      <Badge
                        variant={
                          post?.status === "published" ? "default" : "secondary"
                        }
                        className="shrink-0"
                      >
                        {post?.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{post?.author?.username}</span>
                      <span>{relativeTimeFormat(post.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
