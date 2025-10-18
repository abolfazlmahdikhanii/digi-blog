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

const users = [
  {
    id: 1,
    name: "Jane Doe",
    email: "jane.doe@example.com",
    avatar: "https://picsum.photos/seed/101/40/40",
    role: "Author",
    status: "Active",
    posts: 25,
  },
  {
    id: 2,
    name: "John Appleseed",
    email: "john.appleseed@example.com",
    avatar: "https://picsum.photos/seed/102/40/40",
    role: "Reader",
    status: "Active",
    posts: 0,
  },
  {
    id: 3,
    name: "Emily White",
    email: "emily.white@example.com",
    avatar: "https://picsum.photos/seed/103/40/40",
    role: "Author",
    status: "Active",
    posts: 12,
  },
  {
    id: 4,
    name: "Alex Johnson",
    email: "alex.j@example.com",
    avatar: "https://picsum.photos/seed/104/40/40",
    role: "Admin",
    status: "Active",
    posts: 5,
  },
  {
    id: 5,
    name: "Samantha Green",
    email: "sam.g@example.com",
    avatar: "https://picsum.photos/seed/105/40/40",
    role: "Reader",
    status: "Banned",
    posts: 0,
  },
  {
    id: 6,
    name: "Ben Carter",
    email: "ben.carter@example.com",
    avatar: "https://picsum.photos/seed/106/40/40",
    role: "Author",
    status: "Inactive",
    posts: 3,
  },
];

export default function AdminUsersPage() {
  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-headline font-bold">User Management</h2>
          <div className="flex items-center gap-2">
            <Input placeholder="Search users..." className="w-64" />
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              New User
            </Button>
          </div>
        </div>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Posts</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{user.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === "Active"
                          ? "default"
                          : user.status === "Banned"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {user.status}
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
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button variant="outline" size="sm">
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
