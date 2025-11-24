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
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { formatDate, relativeTimeFormat } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminContentPage() {
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
    queryKey: ["admin-posts"],
    queryFn: ({ pageParam }) =>
      fetch(`/api/admin/posts?page=${pageParam}&limit=10`).then((res) =>
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
  const [isDelete, setIsDelete] = useState(false);
  const [removeId, setRemoveId] = useState(null);
  if (isLoading) {
    return (
      <div className="fixed top-1/2 left-1/2 -translate-1/2">
        <Spinner className={"w-8 h-8"} />
      </div>
    );
  }

  const removePostHandler = async (id) => {
    try {
      const res = await fetch(`/api/user/post/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to remove post");
      }

      toast.success("Post removed successfully :)");
      setIsDelete(false);
      refetch();
    } catch (error) {
      toast.error("Failed to create post");
    }
  };
  const allPosts = data?.pages.flatMap((page) => page.posts) || [];
  const dataPosts = data?.pages.flatMap((page) => page) || [];

  return (
    <AdminLayout>
      <div className="space-y-4 w-full flex-1">
        <div className="flex justify-between items-center w-full">
          <h2 className="text-2xl font-headline font-bold">
            Content Management
          </h2>
          <div className="flex items-center gap-2">
            {/* <Input placeholder="Search posts..." className="w-64" /> */}
            
          </div>
        </div>
        {allPosts.length > 0 ? (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>

                  <TableHead>Date</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allPosts.map((post) => (
                  <TableRow key={post._id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>{post.author.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          post.status === "published"
                            ? "default"
                            : post.status === "Draft"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {post.status}
                      </Badge>
                    </TableCell>

                    <TableCell>{formatDate(post.createdAt)}</TableCell>
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
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              setRemoveId(post._id);
                              setIsDelete(true);
                            }}
                          >
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
        ) : (
          <p className="text-muted-foreground text-center py-12">
            You haven’t published any public stories yet.
          </p>
        )}
        {dataPosts && dataPosts.hasMore && (
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchPreviousPage()}
              disabled={!dataPosts.prevPage || isFetchingPreviousPage}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchNextPage()}
              disabled={!dataPosts.nextPage || isFetchingNextPage}
            >
              Next
            </Button>
          </div>
        )}
      </div>
      {isDelete && (
        <AlertDialog open={isDelete} onOpenChange={setIsDelete}>
          {" "}
          <AlertDialogContent className={"h-[200px]"}>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete story</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this post? This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-full">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive hover:bg-destructive/90 rounded-full"
                onClick={() => removePostHandler(removeId)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </AdminLayout>
  );
}
