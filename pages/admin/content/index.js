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
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import AdminLayout from "@/components/admin-layout";

const posts = [
  {
    id: 1,
    title: "The Future of Artificial Intelligence",
    author: "Jane Doe",
    status: "Published",
    comments: 128,
    date: "2024-05-20",
  },
  {
    id: 2,
    title: "A Deep Dive into Sustainable Living",
    author: "John Appleseed",
    status: "Published",
    comments: 72,
    date: "2024-05-18",
  },
  {
    id: 3,
    title: "Mastering the Art of Modern Web Design",
    author: "Emily White",
    status: "Draft",
    comments: 0,
    date: "2024-05-15",
  },
  {
    id: 4,
    title: "The Unseen World of Urban Exploration",
    author: "Alex Johnson",
    status: "Published",
    comments: 23,
    date: "2024-05-12",
  },
  {
    id: 5,
    title: "The Psychology of Color in Branding",
    author: "Samantha Green",
    status: "In Review",
    comments: 5,
    date: "2024-05-10",
  },
  {
    id: 6,
    title: "An Introduction to Quantum Computing",
    author: "Ben Carter",
    status: "Published",
    comments: 45,
    date: "2024-05-08",
  },
];

export default function AdminContentPage() {
  return (
    <AdminLayout>
      <div className="space-y-4 w-full flex-1">
        <div className="flex justify-between items-center w-full">
          <h2 className="text-2xl font-headline font-bold">
            Content Management
          </h2>
          <div className="flex items-center gap-2">
            <Input placeholder="Search posts..." className="w-64" />
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Post
            </Button>
          </div>
        </div>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Comments</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.author}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        post.status === "Published"
                          ? "default"
                          : post.status === "Draft"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {post.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{post.comments}</TableCell>
                  <TableCell>{post.date}</TableCell>
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
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Delete
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
