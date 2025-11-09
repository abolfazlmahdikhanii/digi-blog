import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useQuery } from "@tanstack/react-query";
import postSchema from "@/validations/post";
import { ScrollArea } from "./ui/scroll-area";
import { toast } from "sonner";
import z, { number } from "zod";
import { DialogHeader, DialogTitle } from "./ui/dialog";
import { Spinner } from "./ui/spinner";
import { Switch } from "./ui/switch";
import { useRouter } from "next/router";

export function PublishingModal({ title, content, onClose, storyId, clear }) {
  const { data, isLoading } = useQuery({
    queryKey: ["category"],
    queryFn: () => fetch("/api/categories").then((res) => res.json()),
  });
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("draft");
  const [isPostLoading, setIsPostLoading] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [readTime, setReadTime] = useState(0);
  const [showComment, setShowComment] = useState(1);
  const [coverImage, setCoverImage] = useState(null);
  const router = useRouter();
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      if (tags.length < 5) {
        setTags([...tags, { id: Date.now(), name: tagInput.trim() }]);
        setTagInput("");
      }
    }
  };

  const removeTag = (idToRemove) => {
    setTags(tags.filter((tag) => tag.id !== idToRemove));
  };

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      setCoverImage(file);
    }
  };

  const uploadPostCoverHandler = async (file) => {
    const maxSize = 2 * 1024 * 1024;
    if (file) {
      if (file.size > maxSize) {
        toast.error("File size must be less than 2 MB");
        return;
      }
      try {
        const form = new FormData();
        form.append("image", file);
        form.append("title", title);
        const res = await fetch("/api/upload/post-images", {
          method: "POST",
          body: form,
        });
        if (res.ok) {
          const data = await res.json();

          if (data && data.success && data.url) {
            return {
              success: true,
              url: data.url,
              imgId: data.imgId,
              fid: data.fid,
            };
          }
          if (data && data.url) {
            return {
              success: true,
              url: data.url,
              imgId: data.imgId,
              fid: data.fid,
            };
          }
        }
      } catch (e) {
        console.error("Upload failed", e);
        return { success: false };
      }
    }
  };
  const removePostCover = async (fid) => {
    if (fid) {
      try {
        const res = await fetch(`/api/upload/post-images?fid=${fid}&type=cover`, {
          method: "DELETE",
        });
        if (res.ok) {
          return { success: true };
        }
      } catch (e) {
        console.error("Upload failed", e);
        return { success: false };
      }
    }
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    let imgId = null;
    let fid = null;
    try {
      setIsPostLoading(true);
      const uploadResult = await uploadPostCoverHandler(coverImage);
      if (!uploadResult.success || !uploadResult.url) {
        throw new Error("Upload failed!");
      }
      imgId = uploadResult.imgId;
      fid = uploadResult.fid;
      const tagValues = tags
        ? tags.map((tag) =>
            typeof tag === "string" ? tag : tag.value || tag.label || tag.name
          )
        : [];
      const validPost = postSchema.safeParse({
        title,
        content,
        shortDescription: description,
        tags: tagValues || [],
        status: status || "draft",

        readTime: Number(readTime),
        isShowComment: Number(showComment),
      });

      if (!validPost.success) {
        console.log("Validation errors:", validPost.error);

        // Show validation errors to user
        validPost.error.forEach((err) => {
          const fieldName = err.path[0] || "field";
          toast.error(`${fieldName}: ${err.message}`);
        });

        return;
      }

      const res = await fetch("/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...validPost.data, //
          category: categoryId,
          postId: storyId,
          imgId,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create post");
      }

      toast.success("Post created successfully :)");
      setIsPostLoading(false);
      onClose();
      setCategoryId("");
      setCoverImage("");
      setDescription("");
      setStatus("draft");
      setTags([]);
      setReadTime(0);
      setShowComment(1);
   
      router.replace("/editor");
    } catch (error) {
      console.log("Error:", error);
      setIsPostLoading(false);
      if (fid) {
        await removePostCover(fid).catch(console.error);
      }

      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create post");
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* <div className="p-6 border-b">
        <h2 className="text-lg font-semibold">Publishing Settings</h2>
      </div> */}
      <DialogHeader className="p-6 border-b">
        <DialogTitle>Publishing Settings</DialogTitle>
      </DialogHeader>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 p-6 overflow-y-auto">
        <ScrollArea className=" h-[430px]">
          <div className="space-y-4 p-4">
            <div>
              <Label
                htmlFor="description"
                className="font-semibold mb-1 text-sm"
              >
                Story Description
              </Label>
              <p className="text-xs text-muted-foreground mb-3">
                Add a short description that will appear on story previews. (200
                characters max)
              </p>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={200}
                className="h-30"
              />
              <p className="text-[10px] text-muted-foreground text-right mt-1.5">
                {description.length}/200
              </p>
            </div>
            <div>
              <Label
                htmlFor="description"
                className="font-semibold mb-1 text-sm"
              >
                Category
              </Label>
              <Select onValueChange={(value) => setCategoryId(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    {!!data?.categories?.length &&
                      data?.categories?.map((item) => (
                        <SelectItem
                          key={item._id.toString()}
                          value={item._id.toString()}
                        >
                          {item.name}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label
                htmlFor="description"
                className="font-semibold mb-1 text-sm"
              >
                status
              </Label>
              <Select onValueChange={(value) => setStatus(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={"draft"}>Draft</SelectItem>
                    <SelectItem value={"published"}>Publish</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tags" className="font-semibold mb-1 text-sm">
                Tags
              </Label>
              <p className="text-xs text-muted-foreground mb-3">
                Add up to 5 tags to help readers discover your story.
              </p>
              <div className="border rounded-md p-2 flex flex-wrap gap-2 items-center">
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center gap-1 bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm"
                  >
                    <span>{tag.name}</span>
                    <button onClick={() => removeTag(tag.id)}>
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder={tags.length < 5 ? "Add a tag..." : "5 tags max"}
                  className="border-0 focus-visible:ring-0 shadow-none flex-1 min-w-[100px]  h-auto py-1 px-1.5 bg-transparent"
                  disabled={tags.length >= 5}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="read" className="font-semibold mb-1 text-sm">
                read time
              </Label>
              <Input
                id="read"
                type={"number"}
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="show" className="font-semibold mb-1 text-sm">
                hidden comment
              </Label>
              <Switch
                id="show"
                onCheckedChange={(checked) =>
                  checked ? setShowComment(0) : setShowComment(1)
                }
                checked={!showComment}
              />
            </div>
          </div>
        </ScrollArea>
        <div className="flex flex-col items-center">
          <Label className="self-start font-semibold mb-1 text-sm">
            Story Preview
          </Label>
          <p className="self-start text-xs text-muted-foreground mb-1.5">
            This is how your story will appear in feeds and on social media.
          </p>
          <div className="w-full  max-h-[400px] max-w-sm border rounded-lg overflow-hidden bg-card mt-4 h-full">
            <label htmlFor="cover-image-upload" className="cursor-pointer">
              <div className="w-full h-full aspect-video bg-secondary/50 hover:bg-secondary flex items-center  justify-center relative">
                {coverImage ? (
                  <img
                    src={URL.createObjectURL(coverImage)}
                    alt="Cover preview"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <ImagePlus className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm font-semibold">Add a cover image</p>
                    <p className="text-xs">16:9 ratio recommended</p>
                  </div>
                )}
              </div>
            </label>
            <Input
              id="cover-image-upload"
              type="file"
              className="sr-only"
              onChange={handleImageUpload}
              accept="image/*"
            />
          </div>
        </div>
      </div>
      <div className="p-6 border-t flex justify-end">
        <Button
          className="bg-green-600 hover:bg-green-700 text-white "
          onClick={onSubmitForm}
          disabled={
            !content ||
            !title ||
            !coverImage ||
            !description ||
            !categoryId ||
            isPostLoading
          }
        >
          {isPostLoading && <Spinner />}
          Publish Now
        </Button>
      </div>
    </div>
  );
}
