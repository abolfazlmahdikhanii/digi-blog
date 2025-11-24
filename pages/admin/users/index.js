import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import AdminLayout from "@/components/admin-layout";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import { formatDate, verifyRefreshToken, verifyToken } from "@/lib/utils";
import connectToDB from "@/configs/db";
import usersModel from "@/models/users";

export default function AdminUsersPage() {
  const {
    data,
    isLoading,
    refetch,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    fetchPreviousPage,
    isFetchingPreviousPage,
  } = useInfiniteQuery({
    queryKey: ["admin-users"],
    queryFn: ({ pageParam }) =>
      fetch(`/api/admin/users?page=${pageParam}&limit=10`).then((res) =>
        res.json()
      ),
    getNextPageParam: (lastPage) => {
      return lastPage.nextPage ?? undefined;
    },
    getPreviousPageParam: (firstPage) => {
      return firstPage.prevPage ?? undefined;
    },
    initialPageParam: 1,
  });

  if (isLoading) {
    return (
      <div className="fixed top-1/2 left-1/2 -translate-1/2">
        <Spinner className={"w-8 h-8"} />
      </div>
    );
  }
  const allUsers = data?.pages.flatMap((page) => page.users) || [];
  const dataUser = data?.pages.flatMap((page) => page) || [];
  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-headline font-bold">User Management</h2>
          <div className="flex items-center gap-2">
            {/* <Input placeholder="Search users..." className="w-64" /> */}
          </div>
        </div>
        {allUsers && allUsers.length > 0 ? (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Username</TableHead>

                  <TableHead>Role</TableHead>
                  <TableHead>Login Date</TableHead>

                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={user?.profileImage}
                            alt={user.name}
                          />
                          <AvatarFallback className={"capitalize"}>
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{user.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Badge variant={"secondary"}>
                        {formatDate(user.createdAt)}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.posts}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>Edit User</DropdownMenuItem>
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Ban User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-12">
            You haven’t published any public stories yet.
          </p>
        )}
        {dataUser && dataUser.hasMore && (
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchPreviousPage()}
              disabled={!dataUser.prevPage || isFetchingPreviousPage}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchNextPage()}
              disabled={!dataUser.nextPage || isFetchingNextPage}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
export async function getServerSideProps(context) {
  const { token, refreshToken } = context.req.cookies;
  await connectToDB();
  if (!token) {
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
  if (user.role !== "ADMIN") {
    return {
      redirect: {
        destination: "/",
      },
    };
  }
  return { props: {} };
}
