"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDown, ChevronRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import ProfileInformationModal from "@/components/profile-information-modal";
import { UsernameAndSubdomainModal } from "@/components/username-subdomain-modal";
import { EmailAddressModal } from "@/components/email-address-modal";
import { toast } from "sonner";
import userSchema from "@/validations/user";
import { useAuth } from "@/context/AuthContext";
import usersModel from "@/models/users";
import { verifyRefreshToken, verifyToken } from "@/lib/utils";
import connectToDB from "@/configs/db";

const MastodonIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M21.258 13.413c.83-.508 1.442-1.39 1.442-2.436v-1.92c0-2.43-1.633-3.235-4.5-3.53h-.255V10.4c2.254.12 3.86.61 3.86 1.876 0 .973-.83 1.585-2.127 1.83v.04c1.65.19 2.5.99 2.5 2.14v1.65c0 1.25-.973 2.19-2.75 2.45v2.585H17.8V20.4c-2.25-.12-3.86-.61-3.86-1.87 0-.97.83-1.586 2.127-1.83v-.04c-1.65-.19-2.5-.99-2.5-2.14v-1.65c0-1.25.973-2.19 2.75-2.45V5.51h-2.9v15.48h-2.18V5.51h-2.9v15.48H5.97V5.51H2.75V3.53h11.73c2.25 0 3.86.61 3.86 2.56v1.92c0 1.25-.973 2.19-2.75 2.45v.04c1.65.19 2.5.99 2.5 2.14v1.65c0 .3-.02.58-.06.84z" />
  </svg>
);
const FacebookIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" />
  </svg>
);
const XIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const GoogleIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 48 48"
    fill="none"
  >
    <path
      fill="#4285F4"
      d="M43.611 20.083H24v8.832h11.303c-1.649 4.657-6.08 8.02-11.303 8.02-8.336 0-15.09-6.754-15.09-15.09s6.754-15.09 15.09-15.09c4.64 0 8.707 2.176 11.45 5.568l7.071-7.071C38.239 4.686 31.623 1.917 24 1.917 10.732 1.917 0 12.649 0 25.917S10.732 50 24 50c11.427 0 20.78-7.925 23.456-18.616H24v-11.301z"
    />
  </svg>
);

function SettingsItem({
  children,
  title,
  description,
  isLink,
  modalContent,
  modalTitle,
  modalDescription,
  startContent,
  open,
  setOpen,
}) {
  const hasModal = modalContent ? true : false;
  const content = (
    <div className="flex justify-between items-center py-3 sm:py-4 cursor-pointer hover:bg-accent/50 -mx-2 sm:-mx-4 px-2 sm:px-4 transition-colors">
      <div className="flex-grow flex items-center gap-3 sm:gap-4 min-w-0">
        <div className="w-full min-w-0">
          <h3 className="font-semibold text-sm">{title}</h3>
          {description && (
            <p className="text-xs text-muted-foreground mt-1 max-w-prose line-clamp-2 sm:line-clamp-none sm:whitespace-nowrap">
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4.5 ml-2 sm:ml-4 shrink-0 text-sm">
        {children}
        {isLink && (
          <ArrowDown className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground -rotate-130" />
        )}
      </div>
    </div>
  );

  if (hasModal) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{content}</DialogTrigger>
        <DialogContent className="max-w-[100vw]  sm:max-w-lg">
          {modalContent ? (
            modalContent
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>{modalTitle || title}</DialogTitle>
                {modalDescription && (
                  <DialogDescription>{modalDescription}</DialogDescription>
                )}
              </DialogHeader>
              <div className="py-4">
                <p className="text-muted-foreground">
                  This is a placeholder for the settings modal content.
                </p>
              </div>
              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button variant="outline" className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button className="w-full sm:w-auto">Save Changes</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  if (startContent) {
    return (
      <div className="flex justify-between items-center py-3 sm:py-4 cursor-pointer hover:bg-accent/50 -mx-2 sm:-mx-4 px-2 sm:px-4 transition-colors">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
          <div className="shrink-0">{startContent}</div>
          <div className="min-w-0">
            <h3 className="font-semibold text-sm">{title}</h3>
            {description && (
              <p className="text-xs text-muted-foreground mt-1 max-w-prose line-clamp-2 sm:line-clamp-none">
                {description}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-2.5 ml-2 shrink-0">
          {children}
          {isLink && (
            <ArrowDown className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground -rotate-130" />
          )}
        </div>
      </div>
    );
  }

  return content;
}

export default function SettingsPage() {
  const { user, refetch } = useAuth();
  const [activeTab, setActiveTab] = useState("account");

  const [openEmailModal, setOpenEmailModal] = useState(false);
  const [openUserModal, setOpenUserModal] = useState(false);
  const [openInfoModal, setOpenInfoModal] = useState(false);

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <div className="grid grid-cols-12 gap-6 sm:gap-8 lg:gap-16">
        <div className="col-span-12 lg:col-span-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-headline mb-4 sm:mb-6 md:mb-8">
            Settings
          </h1>
          <Tabs defaultValue="account">
            <TabsList className="bg-transparent p-0 border-b w-full justify-start rounded-none gap-x-3 sm:gap-x-4 md:gap-x-5 overflow-x-auto flex-nowrap">
              <TabsTrigger
                value="account"
                className="rounded-none border-0 flex-0 text-sm transition-all
  text-muted-foreground hover:text-foreground
  data-[state=active]:shadow-none 
  data-[state=active]:border-b-2 
  data-[state=active]:!border-b-foreground 
  data-[state=active]:text-foreground
  data-[state=active]:bg-transparent"
              >
                Account
              </TabsTrigger>
              <TabsTrigger
                value="publishing"
                className="rounded-none border-0 flex-0 text-sm transition-all
  text-muted-foreground hover:text-foreground
  data-[state=active]:shadow-none 
  data-[state=active]:border-b-2 
  data-[state=active]:!border-b-foreground 
  data-[state=active]:text-foreground
  data-[state=active]:bg-transparent"
              >
                Publishing
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="rounded-none border-0 flex-0 text-sm transition-all
  text-muted-foreground hover:text-foreground
  data-[state=active]:shadow-none 
  data-[state=active]:border-b-2 
  data-[state=active]:!border-b-foreground 
  data-[state=active]:text-foreground
  data-[state=active]:bg-transparent"
              >
                Notifications
              </TabsTrigger>
              <TabsTrigger
                value="membership"
                className="rounded-none border-0 flex-0 text-sm transition-all
  text-muted-foreground hover:text-foreground
  data-[state=active]:shadow-none 
  data-[state=active]:border-b-2 
  data-[state=active]:!border-b-foreground 
  data-[state=active]:text-foreground
  data-[state=active]:bg-transparent"
              >
                Membership
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="rounded-none border-0 flex-0 text-sm transition-all
              text-muted-foreground hover:text-foreground
              data-[state=active]:shadow-none 
              data-[state=active]:border-b-2 
              data-[state=active]:!border-b-foreground 
              data-[state=active]:text-foreground
              data-[state=active]:bg-transparent"
              >
                Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="account" className="mt-4 sm:mt-6 px-1 sm:px-2">
              <div className="divide-y">
                <SettingsItem
                  title="Email address"
                  open={openEmailModal}
                  setOpen={setOpenEmailModal}
                  modalContent={
                    <EmailAddressModal
                      onClose={() => setOpenEmailModal(false)}
                    />
                  }
                >
                  <span className="text-muted-foreground text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">
                    {user?.email}
                  </span>
                </SettingsItem>
                <SettingsItem
                  title="Username and subdomain"
                  open={openUserModal}
                  setOpen={setOpenUserModal}
                  modalContent={
                    <UsernameAndSubdomainModal
                      onClose={() => setOpenUserModal(false)}
                    />
                  }
                >
                  <span className="text-muted-foreground text-xs sm:text-sm">
                    @{user?.username}
                  </span>
                </SettingsItem>
                <SettingsItem
                  title="Profile information"
                  description="Edit your photo, name, pronouns, short bio, etc."
                  open={openInfoModal}
                  setOpen={setOpenInfoModal}
                  modalContent={
                    <ProfileInformationModal
                      onClose={() => setOpenInfoModal(false)}
                    />
                  }
                >
                  <div className="flex items-center gap-2 sm:gap-2.5 text-muted-foreground">
                    <span className="capitalize text-xs sm:text-sm hidden sm:inline">
                      {user?.name}
                    </span>
                    <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                      <AvatarImage src={user?.profileImage} alt="User" />
                      <AvatarFallback className="capitalize text-xs sm:text-sm">
                        {user?.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </SettingsItem>
                <SettingsItem
                  title="Profile design"
                  description="Customize the appearance of your profile."
                  isLink
                >
                  <span />
                </SettingsItem>
                <SettingsItem
                  title="Custom domain"
                  description="Upgrade to a Medium Membership to redirect your profile URL to a domain like yourdomain.com."
                  isLink
                >
                  <span></span>
                  <span className="text-muted-foreground text-xs sm:text-sm">
                    None
                  </span>
                </SettingsItem>
                <SettingsItem
                  title="Partner Program"
                  description="You are not enrolled in the Partner Program."
                  isLink
                >
                  <span />
                </SettingsItem>
                <SettingsItem
                  title="Your DigiBlog Digest frequency"
                  description="Adjust how often you see a new Digest."
                >
                  <span></span>
                  <div onClick={(e) => e.stopPropagation()}>
                    <Select defaultValue="daily">
                      <SelectTrigger className="w-[100px] sm:w-[120px] focus:ring-0 text-xs sm:text-sm">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </SettingsItem>
                <SettingsItem
                  title="Provide Feedback"
                  description="Receive occasional invitations to share your feedback with DigiBlog."
                >
                  <span></span>
                  <div onClick={(e) => e.stopPropagation()}>
                    <Checkbox id="feedback" className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                </SettingsItem>
                <SettingsItem
                  title="Allow private notes from"
                  description="Anyone"
                >
                  <span></span>
                  <div onClick={(e) => e.stopPropagation()}>
                    <Select defaultValue="anyone">
                      <SelectTrigger className="w-[100px] sm:w-[120px] focus:ring-0 text-xs sm:text-sm">
                        <SelectValue placeholder="Anyone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="anyone">Anyone</SelectItem>
                        <SelectItem value="mutuals">
                          People you follow
                        </SelectItem>
                        <SelectItem value="nobody">Nobody</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </SettingsItem>
                <SettingsItem title="Connected accounts">
                  <span></span>
                  <span className="text-muted-foreground text-xs sm:text-sm">
                    Not connected
                  </span>
                </SettingsItem>
                <SettingsItem
                  title="Account and data"
                  description="Download your information, and deactivate or delete your account."
                >
                  <span />
                </SettingsItem>
              </div>
            </TabsContent>

            <TabsContent
              value="publishing"
              className="mt-4 sm:mt-6 px-1 sm:px-2"
            >
              <h2 className="text-xl sm:text-2xl font-bold font-headline mb-3 sm:mb-4">
                Email notifications
              </h2>
              <div className="divide-y">
                <SettingsItem
                  title="Allow readers to leave private notes on your stories"
                  description="Private notes are visible to you and (if left in a publication) all Editors of the publication."
                >
                  <span></span>
                  <div onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      id="private-notes"
                      defaultChecked
                      className="h-4 w-4 sm:h-5 sm:w-5"
                    />
                  </div>
                </SettingsItem>
                <SettingsItem
                  title="Manage tipping on your stories"
                  description="Readers can send you tips through the third-party platform of your choice."
                >
                  <span></span>
                  <span className="text-muted-foreground text-xs sm:text-sm">
                    Disabled
                  </span>
                </SettingsItem>
                <SettingsItem
                  title="Allow email replies"
                  description="Let readers reply to your stories directly from their email."
                >
                  <span></span>
                  <div onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      id="email-replies"
                      className="h-4 w-4 sm:h-5 sm:w-5"
                    />
                  </div>
                </SettingsItem>
                <SettingsItem
                  title="'Reply To' email address"
                  description="Shown to your subscribers when they reply."
                >
                  <span></span>
                  <span className="text-muted-foreground text-xs sm:text-sm truncate max-w-[150px] sm:max-w-none">
                    mahdikhaniabolfazl@gmail.com
                  </span>
                </SettingsItem>
                <SettingsItem
                  title="Import email subscribers"
                  description="Upload a CSV or TXT file containing up to 25,000 email addresses."
                  isLink
                >
                  <span></span>
                </SettingsItem>
              </div>
              <div className="mt-8 sm:mt-12">
                <h2 className="text-xl sm:text-2xl font-bold font-headline mb-3 sm:mb-4">
                  Promote email subscriptions
                </h2>
                <div className="bg-card border rounded-lg p-4 sm:p-6 text-xs sm:text-sm text-muted-foreground">
                  <p>
                    We've simplified things. These options are no longer
                    available, as your readers can now opt in for email
                    notifications more easily from your story page.{" "}
                    <Link href="#" className="underline text-foreground">
                      Read more here
                    </Link>
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value="notifications"
              className="mt-4 sm:mt-6 px-1 sm:px-2"
            >
              <h2 className="text-xl sm:text-2xl font-bold font-headline mb-3 sm:mb-4">
                Email notifications
              </h2>
              <div className="divide-y">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold font-headline mt-4 sm:mt-6 mb-2">
                    Story recommendations
                  </h3>
                  <SettingsItem
                    title="New DigiBlog Digest"
                    description="The best stories on DigiBlog personalized based on your interests, as well as outstanding stories selected by our editors."
                  >
                    <span></span>
                    <div onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        id="digest"
                        defaultChecked
                        className="h-4 w-4 sm:h-5 sm:w-5"
                      />
                    </div>
                  </SettingsItem>
                  <SettingsItem
                    title="Recommended reading"
                    description="Featured stories, columns, and collections that we think you'll enjoy based on your reading history."
                  >
                    <span></span>
                    <div onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        id="recommended-reading"
                        defaultChecked
                        className="h-4 w-4 sm:h-5 sm:w-5"
                      />
                    </div>
                  </SettingsItem>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold font-headline mt-4 sm:mt-6 mb-2">
                    From writers and publications
                  </h3>
                  <SettingsItem title="New stories added to lists you've saved">
                    <span></span>
                    <div onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        id="new-stories-saved"
                        defaultChecked
                        className="h-4 w-4 sm:h-5 sm:w-5"
                      />
                    </div>
                  </SettingsItem>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold font-headline mt-4 sm:mt-6 mb-2">
                    Social activity
                  </h3>
                  <SettingsItem title="Follows and matching highlights">
                    <span></span>
                    <div onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        id="follows"
                        defaultChecked
                        className="h-4 w-4 sm:h-5 sm:w-5"
                      />
                    </div>
                  </SettingsItem>
                  <SettingsItem title="Replies to your responses">
                    <span></span>
                    <div onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        id="replies"
                        defaultChecked
                        className="h-4 w-4 sm:h-5 sm:w-5"
                      />
                    </div>
                  </SettingsItem>
                  <SettingsItem title="Story mentions">
                    <span></span>
                    <div onClick={(e) => e.stopPropagation()}>
                      <Select defaultValue="network">
                        <SelectTrigger className="w-[120px] sm:w-[140px] focus:ring-0 text-xs sm:text-sm">
                          <SelectValue placeholder="Select network" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="network">In network</SelectItem>
                          <SelectItem value="anyone">From anyone</SelectItem>
                          <SelectItem value="off">Off</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </SettingsItem>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold font-headline mt-4 sm:mt-6 mb-2">
                    For writers
                  </h3>
                  <SettingsItem title="Activity on your published stories">
                    <span></span>
                    <div onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        id="activity-published"
                        defaultChecked
                        className="h-4 w-4 sm:h-5 sm:w-5"
                      />
                    </div>
                  </SettingsItem>
                  <SettingsItem title="Activity on your lists">
                    <span></span>
                    <div onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        id="activity-lists"
                        defaultChecked
                        className="h-4 w-4 sm:h-5 sm:w-5"
                      />
                    </div>
                  </SettingsItem>
                  <SettingsItem title="From editors about featuring your stories">
                    <span></span>
                    <div onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        id="editor-features"
                        defaultChecked
                        className="h-4 w-4 sm:h-5 sm:w-5"
                      />
                    </div>
                  </SettingsItem>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold font-headline mt-4 sm:mt-6 mb-2">
                    For publications
                  </h3>
                  <SettingsItem title="New submissions">
                    <span></span>
                    <div onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        id="new-submissions"
                        defaultChecked
                        className="h-4 w-4 sm:h-5 sm:w-5"
                      />
                    </div>
                  </SettingsItem>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold font-headline mt-4 sm:mt-6 mb-2">
                    Others from DigiBlog
                  </h3>
                  <SettingsItem title="New product features from DigiBlog">
                    <span></span>
                    <div onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        id="product-features"
                        defaultChecked
                        className="h-4 w-4 sm:h-5 sm:w-5"
                      />
                    </div>
                  </SettingsItem>
                  <SettingsItem title="Information about DigiBlog membership">
                    <span></span>
                    <div onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        id="membership-info"
                        defaultChecked
                        className="h-4 w-4 sm:h-5 sm:w-5"
                      />
                    </div>
                  </SettingsItem>
                  <SettingsItem title="Writing updates and announcements">
                    <span></span>
                    <div onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        id="writing-updates"
                        defaultChecked
                        className="h-4 w-4 sm:h-5 sm:w-5"
                      />
                    </div>
                  </SettingsItem>
                </div>
                <SettingsItem
                  title="Allow email notifications"
                  description="You'll still receive administrative emails even if this setting is off."
                >
                  <span></span>
                  <div onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      id="allow-all-emails"
                      defaultChecked
                      className="h-4 w-4 sm:h-5 sm:w-5"
                    />
                  </div>
                </SettingsItem>
              </div>

              <div className="mt-8 sm:mt-12">
                <h2 className="text-xl sm:text-2xl font-bold font-headline mb-3 sm:mb-4">
                  Push notifications
                </h2>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Open the DigiBlog app from your mobile device to make changes
                  to push notifications.
                </p>
              </div>
            </TabsContent>

            <TabsContent
              value="membership"
              className="mt-4 sm:mt-6 px-1 sm:px-2"
            >
              <div className="divide-y">
                <SettingsItem
                  title="Upgrade to a DigiBlog Membership"
                  description="Subscribe for unlimited access to the smartest writers and biggest ideas on DigiBlog."
                  isLink
                ></SettingsItem>
              </div>
            </TabsContent>

            <TabsContent value="security" className="mt-4 sm:mt-6 px-1 sm:px-2">
              <div className="divide-y">
                <SettingsItem
                  title="Sign out of all other sessions"
                  description="Sign out of sessions in other browsers or on other computers."
                ></SettingsItem>
                <SettingsItem
                  title="Download your information"
                  description="Download a copy of the information you've shared on DigiBlog to a .zip file."
                ></SettingsItem>
                <SettingsItem
                  title={
                    <span className="font-bold">
                      Create Mastodon account on @me.dm
                    </span>
                  }
                  description="Join our premium instance exclusively for DigiBlog members at me.dm."
                  isLink
                  startContent={
                    <MastodonIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  }
                ></SettingsItem>
                <SettingsItem
                  title="Connect Mastodon"
                  description="Add an existing Mastodon account from another instance."
                  startContent={
                    <MastodonIcon className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
                  }
                ></SettingsItem>
                <SettingsItem
                  title="Connect Facebook"
                  description="We will never post to Facebook or message your friends without your permission."
                  isLink
                  startContent={
                    <FacebookIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  }
                ></SettingsItem>
                <SettingsItem
                  title="Connect X"
                  description="We will never post to X or message your followers without your permission."
                  startContent={
                    <XIcon className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
                  }
                  isLink
                ></SettingsItem>
                <SettingsItem
                  title={
                    <span className="text-destructive">Disconnect Google</span>
                  }
                  description="You can now sign in to DigiBlog using your Google account."
                  startContent={
                    <GoogleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  }
                >
                  <div className="flex items-center gap-2 sm:gap-4">
                    <span className="text-muted-foreground text-xs sm:text-sm truncate max-w-[150px] sm:max-w-none">
                      mahdikhaniabolfazl@gmail.com
                    </span>
                  </div>
                </SettingsItem>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="hidden lg:block col-span-4">
          <h3 className="font-bold text-lg mb-4 font-headline">
            Suggested help
          </h3>
          <ul className="space-y-4">
            <li>
              <Link href="#" className="text-sm hover:underline">
                How to write a great story
              </Link>
            </li>
            <li>
              <Link href="#" className="text-sm hover:underline">
                Formatting your post
              </Link>
            </li>
            <li>
              <Link href="#" className="text-sm hover:underline">
                Using the editor
              </Link>
            </li>
            <li>
              <Link href="#" className="text-sm hover:underline">
                Managing your profile
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
export async function getServerSideProps(context) {
  const { token, refreshToken } = context.req.cookies;
  await connectToDB();
  if (!token && !refreshToken) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }
  const validToken = verifyToken(token);
  const validRefreshToken = verifyRefreshToken(refreshToken);
  if (!validToken && !validRefreshToken) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }
  const user = await usersModel.findOne({
    email: validToken.email || validRefreshToken.email,
  });
  if (!user) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }
  return { props: {} };
}
