"use client";
import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowDown, ExternalLink, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import z from "zod";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import userSchema from "@/validations/user";
import Image from "next/image";

export default function ProfileInformationModal({ onClose }) {
  const { user, refetch } = useAuth();
  const [profileImage, setProfileImage] = useState(null);
  const [uploadImage, setUploadImage] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isRemoveLoading, setIsRemoveLoading] = useState(false);

  const [name, setName] = useState(user.name || "");

  const [bio, setBio] = useState(user.bio || "");
  const [job, setJob] = useState(user.job || "");

  const handleImageUpload = useCallback((e) => {
    const maxSize = 2 * 1024 * 1024;
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      if (file.size > maxSize) {
        toast.error("File size must be less than 2 MB");
        return;
      } else {
        setProfileImage(url);
        setUploadImage(file);
      }
    }
  }, []);

  const uploadProfileImageHandler = async (file) => {
    if (file) {
      try {
        const form = new FormData();
        form.append("image", file);

        const res = await fetch("/api/upload/profile-image", {
          method: "POST",
          body: form,
        });
        if (res.ok) {
          const data = await res.json();

          if (data && data.success && data.url) {
            return { success: true, url: data.url, fid: data.fid };
          }
          if (data && data.url) {
            return { success: true, url: data.url, fid: data.fid };
          }
        }
      } catch (e) {
        console.error("Upload failed", e);
        return { success: false };
      }
    }
  };
  const removeProfileImage = async (fid) => {
    if (fid) {
      try {
       
          setIsRemoveLoading(true);
        
        const res = await fetch(`/api/upload/profile-image?fid=${fid}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setProfileImage(null);

          
          setIsRemoveLoading(false);
          refetch();
          return { success: true };
        }
      } catch (e) {
        console.error("Upload failed", e);
        setIsRemoveLoading(false);
        return { success: false };
      }
    }
  };

  const onSubmitProfileForm = async (e) => {
    e.preventDefault();
    let fid = null;
    try {
      setIsProfileLoading(true);
      const uploadResult = await uploadProfileImageHandler(uploadImage);

      if (!uploadResult.success || !uploadResult.url) {
        throw new Error("Upload failed!");
      }
      fid = uploadResult.fid;

      const validUser = userSchema.safeParse({
        name,
        bio,
        job,
        profileImage: uploadResult.url ?? null,
        imgId: uploadResult.fid ?? null,
      });

      if (!validUser.success) {
        console.log("Validation errors:", validUser.error);

        // Show validation errors to user
        validUser.error.forEach((err) => {
          const fieldName = err.path[0] || "field";
          toast.error(`${fieldName}: ${err.message}`);
        });

        return;
      }

      const res = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...validUser.data, //
          imgId: uploadResult.fid ?? null,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      toast.success("Profile updated successfully :)");
      setIsProfileLoading(false);
      onClose();
      refetch();
      setName("");
      setJob("");
      setBio("");
      setProfileImage("");
    } catch (error) {
      console.log("Error:", error);
      setIsProfileLoading(false);
      if (fid) {
        await removeProfileImage(fid).catch(console.error);
      }

      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update profile");
      }
    }
  };
  return (
    <>
      <DialogHeader>
        <DialogTitle>Profile information</DialogTitle>
      </DialogHeader>

      <div className="py-4 space-y-6">
        {/* Photo Section */}
        <div className="flex gap-6 items-start">
          <Label className="mt-2 w-20 shrink-0">Photo</Label>
          <div className="flex-grow">
            <div className="flex items-center gap-4">
              {profileImage ? (
                <Image
                  width={64}
                  height={64}
                  src={profileImage}
                  alt="user"
                  className="min-w-[64px] h-[64px] overflow-hidden rounded-full "
                />
              ) : (
                <Avatar className="h-16 w-16 relative">
                  <AvatarImage
                    src={profileImage ? profileImage : user?.profileImage}
                    alt="User"
                  />
                  <AvatarFallback className={"capitalize text-sm"}>
                    {user?.name.charAt(0)}
                  </AvatarFallback>
                  {isRemoveLoading &&user.profileImage&& (
                    <Spinner
                      className={
                        "absolute top-1/2 left-1/2 -translate-1/2 after:w-full after:h-full after:bg-white after:backdrop-blur-md after:block"
                      }
                    />
                  )}
                </Avatar>
              )}
              <div>
                <div className="flex gap-4">
                  {user.profileImage.trim() ? (
                    <>
                      <Button
                        variant="link"
                        className="p-0 text-destructive"
                        onClick={() => removeProfileImage(user.imgId)}
                        disabled={isRemoveLoading}
                      >
                        Remove
                      </Button>
                    </>
                  ) : (
                    <Label
                      variant="link"
                      htmlFor="file"
                      className="p-0 text-green-600 hover:text-green-700"
                      disabled={isProfileLoading}
                    >
                      <input
                        id="file"
                        type="file"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={isProfileLoading}
                      />
                      Add
                    </Label>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Recommended: Square JPG, PNG, or GIF, at least 1,000 pixels
                  per side.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Name Section */}
        <div className="flex gap-6 items-start">
          <Label htmlFor="name" className="mt-2 w-20 shrink-0">
            Name*
          </Label>
          <div className="flex-grow">
            <Input
              id="name"
              maxLength={50}
              defaultValue={name}
              onChange={(e) => setName(e.target.value.trim())}
            />
            <p className="text-sm text-muted-foreground text-right mt-1">
              {name.length}/50
            </p>
          </div>
        </div>

        {/* Pronouns Section */}
        <div className="flex gap-6 items-start">
          <Label htmlFor="pronouns" className="mt-2 w-20 shrink-0">
            Job
          </Label>
          <div className="flex-grow">
            <Input
              id="job"
              placeholder="Write your job..."
              defaultValue={job}
              onChange={(e) => setJob(e.target.value.trim())}
            />
            {/* <p className="text-sm text-muted-foreground text-right mt-1">0/4</p> */}
          </div>
        </div>

        {/* Short Bio Section */}
        <div className="flex gap-6 items-start">
          <Label htmlFor="short-bio" className="mt-2 w-20 shrink-0">
            Short bio
          </Label>
          <div className="flex-grow">
            <Textarea
              id="short-bio"
              placeholder=""
              className="min-h-[80px]"
              maxLength={160}
              defaultValue={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            <p className="text-sm text-muted-foreground text-right mt-1">
              {bio.length}/160
            </p>
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold">About Page</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Personalize with images and more to paint more of a vivid
                portrait of yourself than your 'Short bio.'
              </p>
            </div>

            <Link href={`@${user.username}`}>
              <ArrowDown className="h-5 w-5 text-muted-foreground -rotate-130" />
            </Link>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button
          variant="outline"
          className="rounded-full border-green-600 text-green-600 hover:text-green-600 hover:bg-green-50"
          onClick={() => onClose()}
          disabled={isProfileLoading}
        >
          Cancel
        </Button>
        <Button
          className="bg-green-600 hover:bg-green-700 text-white rounded-full"
          disabled={isProfileLoading}
          onClick={onSubmitProfileForm}
        >
          Save {isProfileLoading && <Spinner />}
        </Button>
      </DialogFooter>
    </>
  );
}
