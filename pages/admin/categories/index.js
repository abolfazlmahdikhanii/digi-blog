"use client";

import React, { useState } from "react";
import { DynamicIcon } from "lucide-react/dynamic";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AdminLayout from "@/components/admin-layout";
import categorySchema from "@/validations/categories";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

const Categories = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["category"],
    queryFn: () => fetch("/api/categories").then((res) => res.json()),
  });
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [icon, setIcon] = useState("");
  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      setIsDataLoading(true);
      const validCategory = categorySchema.safeParse({
        name,
        slug,
        icon,
      });

      if (!validCategory.success) {
        console.log("Validation errors:", validCategory.error);

        // Show validation errors to user
        validCategory.error.forEach((err) => {
          const fieldName = err.path[0] || "field";
          toast.error(`${fieldName}: ${err.message}`);
        });

        return;
      }

      const res = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...validCategory.data, //
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create category");
      }

      toast.success("Category created successfully :)");
      setIsDataLoading(false);
      setIsOpenModal(false);
      refetch();
      setName("");
      setSlug("");
      setIcon("");
    } catch (error) {
      console.log("Error:", error);
      setIsDataLoading(false);
      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create post");
      }
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-headline font-bold">
            Category Management
          </h2>
          <Dialog open={isOpenModal} onOpenChange={setIsOpenModal}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>
                  Create a new category for your posts. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <form className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Technology"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    placeholder="technology"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="icon">Icon</Label>
                  <Input
                    id="icon"
                    placeholder="e.g., 'Code' or 'Brain'"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Find available icons on{" "}
                    <a
                      href="https://lucide.dev/icons/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      lucide.dev
                    </a>
                  </p>
                </div>
                <DialogFooter className="mt-4">
                  <Button
                    type="submit"
                    className="w-full"
                    onClick={onSubmitForm}
                    disabled={isLoading}
                  >
                    {isDataLoading && <Spinner />}
                    Save Category
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Icon</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.categories.length ? (
                data?.categories.map((category) => (
                  <TableRow key={category._id}>
                    <TableCell>
                      <div className="w-10 h-10 flex items-center justify-center bg-muted rounded-md">
                        <DynamicIcon
                          name={category.icon.toLowerCase()}
                          className="h-5 w-5"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {category.slug}
                    </TableCell>
                    <TableCell className="text-right">
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
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell>no post</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Categories;
