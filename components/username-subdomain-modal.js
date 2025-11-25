"use client";
import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import userSchema from "@/validations/user";
import z from "zod";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "./ui/spinner";

export function UsernameAndSubdomainModal({ onClose }) {
  const { user, refetch } = useAuth();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(user.username || "");
  const updateUsername = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const validUser = userSchema.safeParse({
        username,
      });

      if (!validUser.success) {
       

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
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      toast.success("Username updated successfully :)");
      setLoading(false);
      onClose();
      refetch();
      setUsername("");
    } catch (error) {
  
      setLoading(false);

      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update username");
      }
    }
  };
  return (
    <>
      <DialogHeader>
        <DialogTitle>Username and subdomain</DialogTitle>
      </DialogHeader>

      <div className="py-4 space-y-6">
        {/* Username Section */}
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            defaultValue={username}
            maxLength={30}
            onChange={(e) => setUsername(e.target.value.trim())}
          />
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>digiblog.com/@{username}</span>
            <span>{username.length}/30</span>
          </div>
        </div>

        {/* Enable Subdomain Section */}
        <div className="flex items-start gap-4 pt-4">
          <Checkbox id="enable-subdomain" className="mt-1" />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="enable-subdomain"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Enable DigiBlog subdomain URL
            </label>
            <p className="text-sm text-muted-foreground">
              Redirect digiblog.com/@username to username.digiblog.com. Note: a
              new profile page on a subdomain may take longer to rank in Google
              search.
            </p>
            <Link
              href="#"
              className="text-sm text-green-600 hover:text-green-700 underline"
            >
              Learn more about subdomain URLs.
            </Link>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button
          variant="outline"
          className="rounded-full border-green-600 text-green-600 hover:text-green-600 hover:bg-green-50"
          onClick={() => onClose()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          className="bg-green-600 hover:bg-green-700 text-white rounded-full"
          onClick={updateUsername}
          disabled={loading}
        >
          Save {loading && <Spinner />}
        </Button>
      </DialogFooter>
    </>
  );
}
