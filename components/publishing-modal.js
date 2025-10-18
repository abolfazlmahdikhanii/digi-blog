"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, X } from "lucide-react";

export function PublishingModal({ title }) {
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState(null);

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
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold">Publishing Settings</h2>
      </div>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 p-6 overflow-y-auto">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className="font-semibold mb-2 text-sm">
              Story Title
            </Label>
            <Input
              id="title"
              value={title}
              readOnly
              className="font-bold text-lg bg-muted/50 mt-1"
            />
          </div>
          <div>
            <Label htmlFor="description" className="font-semibold mb-1 text-sm">
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
        </div>
        <div className="flex flex-col items-center">
          <Label className="self-start font-semibold mb-1 text-sm">Story Preview</Label>
          <p className="self-start text-xs text-muted-foreground mb-1.5">
            This is how your story will appear in feeds and on social media.
          </p>
          <div className="w-full max-w-sm border rounded-lg overflow-hidden bg-card mt-4 h-full" >
            <label htmlFor="cover-image-upload" className="cursor-pointer">
              <div className="w-full aspect-video bg-secondary/50 hover:bg-secondary flex items-center h-full justify-center relative">
                {coverImage ? (
                  <img
                    src={coverImage}
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
        <Button className="bg-green-600 hover:bg-green-700 text-white ">
          Publish Now
        </Button>
      </div>
    </div>
  );
}
