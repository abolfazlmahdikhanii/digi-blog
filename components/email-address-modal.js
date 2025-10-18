"use client";
import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function EmailAddressModal() {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Email address</DialogTitle>
      </DialogHeader>

      <div className="py-4 space-y-2">
        <Input id="email" defaultValue="mahdikhaniabolfazl@gmail.com" />
        <p className="text-sm text-muted-foreground">
          You can sign into EchoJournal with this email address.
        </p>
      </div>

      <DialogFooter>
        <Button
          variant="outline"
          className="rounded-full border-green-600 text-green-600 hover:text-green-600 hover:bg-green-50"
          // onClick={() =>
          //   document.querySelector("[data-radix-dialog-close]")?.click()
          // }
        >
          Cancel
        </Button>
        <Button className="bg-green-600/80 hover:bg-green-600/90 text-white rounded-full">
          Save
        </Button>
      </DialogFooter>
    </>
  );
}
