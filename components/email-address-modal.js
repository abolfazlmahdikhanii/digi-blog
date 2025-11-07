"use client";
import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import userSchema from "@/validations/user";
import z from "zod";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";

export function EmailAddressModal({ onClose }) {
  const { user, refetch } = useAuth();
  const [email, setEmail] = useState(user.email || "");
  const [loading, setLoading] = useState(false);
  const updateEmail = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const validUser = userSchema.safeParse({
        email,
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
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      toast.success("Email updated successfully :)");
      setLoading(false);
      onClose();
      refetch();
      setEmail("");
    } catch (error) {
      console.log("Error:", error);
      setLoading(false);

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
        <DialogTitle>Email address</DialogTitle>
      </DialogHeader>

      <div className="py-4 space-y-2">
        <Input
          id="email"
          defaultValue={email}
          onChange={(e) => setEmail(e.target.value.trim())}
        />
        <p className="text-sm text-muted-foreground">
          You can sign into EchoJournal with this email address.
        </p>
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
          className="bg-green-600/80 hover:bg-green-600/90 text-white rounded-full"
          onClick={updateEmail}
          disabled={loading}
        >
          Save {loading && <Spinner />}
        </Button>
      </DialogFooter>
    </>
  );
}
