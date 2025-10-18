
'use client';
import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ExternalLink, X } from 'lucide-react';
import Link from 'next/link';

export function ProfileInformationModal() {
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
              <Avatar className="h-16 w-16">
                <AvatarImage src="https://picsum.photos/seed/103/100/100" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex gap-4">
                  <Button variant="link" className="p-0 text-green-600 hover:text-green-700">Update</Button>
                  <Button variant="link" className="p-0 text-destructive">Remove</Button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Recommended: Square JPG, PNG, or GIF, at least 1,000 pixels per side.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Name Section */}
        <div className="flex gap-6 items-start">
          <Label htmlFor="name" className="mt-2 w-20 shrink-0">Name*</Label>
          <div className="flex-grow">
            <Input id="name" defaultValue="Mahdikhaniabolfazl" />
            <p className="text-sm text-muted-foreground text-right mt-1">18/50</p>
          </div>
        </div>
        
        {/* Pronouns Section */}
        <div className="flex gap-6 items-start">
          <Label htmlFor="pronouns" className="mt-2 w-20 shrink-0">Pronouns</Label>
           <div className="flex-grow">
            <Input id="pronouns" placeholder="Add..." />
            <p className="text-sm text-muted-foreground text-right mt-1">0/4</p>
          </div>
        </div>

        {/* Short Bio Section */}
        <div className="flex gap-6 items-start">
          <Label htmlFor="short-bio" className="mt-2 w-20 shrink-0">Short bio</Label>
           <div className="flex-grow">
            <Textarea id="short-bio" placeholder="" className="min-h-[80px]" />
            <p className="text-sm text-muted-foreground text-right mt-1">0/160</p>
          </div>
        </div>
        
        <div className="border-t pt-6">
            <div className="flex justify-between items-center">
                <div>
                    <h4 className="font-semibold">About Page</h4>
                    <p className="text-sm text-muted-foreground">Personalize with images and more to paint more of a vivid portrait of yourself than your 'Short bio.'</p>
                </div>
                 <Button variant="ghost" size="icon" asChild>
                    <Link href="/profile/johndoe/edit">
                        <ExternalLink className="h-4 w-4" />
                    </Link>
                </Button>
            </div>
        </div>

      </div>

      <DialogFooter>
        <Button
          variant="outline"
          className="rounded-full border-green-600 text-green-600 hover:text-green-600 hover:bg-green-50"
          // onClick={() =>
          //   (
          //     document.querySelector(
          //       '[data-radix-dialog-close]'
          //     ) as HTMLElement
          //   )?.click()
          // }
        >
          Cancel
        </Button>
        <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full">Save</Button>
      </DialogFooter>
    </>
  );
}
