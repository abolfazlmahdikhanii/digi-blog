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
import {
  Popover,
  PopoverAnchor,
  PopoverArrow,
  PopoverContent,
} from "./ui/popover";

export function PublishingModal({ title, content, onClose, storyId, clear }) {
  const [tagInput, setTagInput] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["topics", tagInput],
    queryFn: () =>
      fetch(`/api/topics?search=${tagInput.trim()}`).then((res) => res.json()),
    enabled: tagInput.trim().length > 1, // only run when input has text
    keepPreviousData: true,
  });

  const [tags, setTags] = useState([]);
  const [tagIds, setTagIds] = useState([]);
  const [description, setDescription] = useState("");

  const [isPostLoading, setIsPostLoading] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [readTime, setReadTime] = useState(0);
  const [showComment, setShowComment] = useState(1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  const router = useRouter();
  const addTag = async (tagName) => {
    try {
      if (
        tags.length < 5 &&
        !tags.some((item) => item.name.toLowerCase() === tagName.toLowerCase())
      ) {
        const res = await fetch("/api/topics", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: tagName }),
        });
        const data = await res.json();
        if (res.status === 201) {
          setTags([...tags, data.data]);
          setTagIds([...tagIds, data.data._id]);
          setTagInput("");
          setShowSuggestions(false);
        }
      }
    } catch (error) {
      
      toast.error("Failed to create topic. Please try again.");
    }
  };
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      addTag(tagInput.trim());
    }
  };

  const removeTag = async (idToRemove) => {
    try {
      const res = await fetch(`/api/topics/remove/${idToRemove}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 200) {
        setTags(tags.filter((tag) => tag._id !== idToRemove));
      }
    } catch (error) {
      toast.error("Failed to remove topic. Please try again.");
    }
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
        const res = await fetch(
          `/api/upload/post-images?fid=${fid}&type=cover`,
          {
            method: "DELETE",
          }
        );
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

      const validPost = postSchema.safeParse({
        title,
        content,
        shortDescription: description,

        readTime: Number(readTime),
        isShowComment: Number(showComment),
      });

      if (!validPost.success) {
      

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

          postId: storyId,
          imgId,
          topics: tagIds,
          // status: "published",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create post");
      }

      toast.success("Post created successfully :)");
      setIsPostLoading(false);
      onClose();

      setCoverImage("");
      setDescription("");

      setTags([]);
      setReadTime(0);
      setShowComment(1);
      setTagIds([]);

      router.replace("/editor");
    } catch (error) {
    
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
          <div className="space-y-4.5 p-4">
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
              <Label htmlFor="tags" className="font-semibold mb-1 text-sm">
                Tags
              </Label>
              <p className="text-xs text-muted-foreground mb-3">
                Add up to 5 tags to help readers discover your story.
              </p>
              <Popover
                open={showSuggestions && data && data.data.length > 0}
                onOpenChange={setShowSuggestions}
              >
                <div className="border rounded-md p-2 flex flex-wrap gap-2 items-center">
                  {tags.map((tag) => (
                    <div
                      key={tag._id}
                      className="flex items-center justify-between gap-1 bg-secondary text-secondary-foreground rounded-lg px-3 py-1 text-sm"
                    >
                      <span>{tag.name}</span>
                      <button onClick={() => removeTag(tag._id)}>
                        <X className="h-3 w-3  cursor-pointer" />
                      </button>
                    </div>
                  ))}
                  <PopoverAnchor asChild>
                    <Input
                      id="tags"
                      autoComplete="off"
                      value={tagInput}
                      onChange={(e) => {
                        setTagInput(e.target.value);
                        if (e.target.value.trim() !== "") {
                          setShowSuggestions(true);
                        } else {
                          setShowSuggestions(false);
                        }
                      }}
                      onKeyDown={handleTagKeyDown}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() =>
                        setTimeout(() => setShowSuggestions(false), 150)
                      }
                      placeholder={
                        tags.length < 5 ? "Add a tag..." : "5 tags max"
                      }
                      className="border-0 focus-visible:ring-0 shadow-none flex-1 min-w-[100px]  h-auto py-1 px-1.5 bg-transparent"
                      disabled={tags.length >= 5}
                    />
                  </PopoverAnchor>
                </div>
                <PopoverContent
                  className="w-[var(--radix-popover-trigger-width)] p-2"
                  onOpenAutoFocus={(e) => e.preventDefault()}
                  sideOffset={10}
                >
                  {data &&
                    data.data.map((suggestion) => (
                      <Button
                        key={suggestion._id ?? suggestion.name}
                        type="button"
                        variant="ghost"
                        className="w-full justify-between"
                        onMouseDown={(e) => {
                          e.preventDefault(); // prevents focus change if needed
                          addTag(suggestion.name); // runs before input blur
                        }}
                      >
                        <div className="w-full flex justify-between p-2">
                          <span>{suggestion.name}</span>
                          <span className="text-muted-foreground">
                            {suggestion.count}
                          </span>
                        </div>
                      </Button>
                    ))}
                  <PopoverArrow />
                </PopoverContent>
              </Popover>
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
            !tags.length ||
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
