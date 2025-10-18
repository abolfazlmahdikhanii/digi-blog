'use client';
import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';

export function UsernameAndSubdomainModal() {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Username and subdomain</DialogTitle>
      </DialogHeader>

      <div className="py-4 space-y-6">
        {/* Username Section */}
        <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" defaultValue="@johndoe" />
            <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>echojournal.com/@johndoe</span>
                <span>18/30</span>
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
              Enable EchoJournal subdomain URL
            </label>
            <p className="text-sm text-muted-foreground">
              Redirect echojournal.com/@username to username.echojournal.com. Note: a new profile page on a subdomain may take longer to rank in Google search.
            </p>
             <Link href="#" className="text-sm text-green-600 hover:text-green-700 underline">Learn more about subdomain URLs.</Link>
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
