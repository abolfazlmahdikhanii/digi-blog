import React from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import {
  AtSign,
  Bell,
  CheckCheck,
  ChevronRight,
  Heart,
  MessageCirclePlusIcon,
  MessageCircleQuestion,
  Trash2,
  Upload,
  UserPlus2Icon,
} from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/router";
import { relativeTimeFormat } from "@/lib/utils";

const NotificationItem = ({
  title,
  message,
  type,
  _id,
  metadata,
  onRead,
  isLoading,
  createdAt,
  isRead,
}) => {
  const router = useRouter();
  let icon = null;
  switch (type) {
    case "NEW_COMMENT":
      icon = <MessageCirclePlusIcon className="stroke-blue-500" />;
      break;
    case "COMMENT_REPLY":
      icon = <MessageCircleQuestion className="stroke-amber-500" />;
      break;
    case "POST_LIKE":
      icon = <Heart className="stroke-red-500" />;
      break;
    case "NEW_FOLLOWER":
      icon = <UserPlus2Icon className="stroke-green-500" />;
      break;
    case "POST_PUBLISHED":
      icon = <Upload className="stroke-indigo-500" />;
      break;
    case "MENTION":
      icon = <AtSign className="stroke-yellow-500" />;
      break;
    case "SYSTEM":
      icon = <Bell />;
      break;

    default:
      icon = <Bell />;
      break;
  }
  return (
    <Alert className={`py-4 bg-accent ${isRead ? "opacity-60" : ""}`}>
      {icon}
      <div className="flex items-center justify-between">
        {metadata.url ? (
          <div onClick={() => router.push(metadata.url)}>
            <AlertTitle className={"mb-1.5"}>{title}</AlertTitle>
            <AlertDescription>{message}</AlertDescription>

            <p className="text-[11px] text-neutral-500 mt-3.5">
              {relativeTimeFormat(createdAt)}
            </p>
          </div>
        ) : (
          <div>
            <AlertTitle className={"mb-1.5"}>{title}</AlertTitle>
            <AlertDescription>{message}</AlertDescription>

            <p className="text-[11px] text-neutral-500 mt-3.5">
              {relativeTimeFormat(createdAt)}
            </p>
          </div>
        )}

        {!isRead ? (
          <div className="flex items-center gap-x-4">
            <Button
              variant={"outline"}
              onClick={onRead}
              disabled={isLoading}
              className={" text-sm"}
              size="icon"
            >
             
              <CheckCheck />
            </Button>
          </div>
        ) : null}
      </div>
    </Alert>
  );
};

export default NotificationItem;
