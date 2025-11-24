import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadCloud, Settings, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import dynamic from "next/dynamic";
import { PublishingModal } from "@/components/publishing-modal";
import { isObject } from "lodash";
import { useAuth } from "@/context/AuthContext";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { verifyRefreshToken, verifyToken } from "@/lib/utils";
import { redirect } from "next/navigation";
import usersModel from "@/models/users";
import { email } from "zod";
import connectToDB from "@/configs/db";

// Import editor dynamically with no SSR
const TextEditor = dynamic(() => import("@/components/text-editor"), {
  ssr: false,
});

export default function EditorPage({ id, initContent }) {
  const { query, replace } = useRouter();
  const queryClient = useQueryClient();

  const [content, setContent] = useState(initContent || null);
  const [title, setTitle] = useState("");
  const [isOpenPublishModal, setIsOpenPublishModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);
  const [storyId, setStoryId] = useState(null);
  const [editorKey, setEditorKey] = useState(Date.now());
  const [editor, setEditor] = useState(null);
  const isSubmittingRef = useRef(false);
  const saveTimeoutRef = useRef(null);
  const isCreatingRef = useRef(false);
  // Use ref to track the latest title value
  const titleRef = useRef(title);

  useEffect(() => {
    setStoryId(query.postId || id);
  }, [id, query.postId, storyId]);
  useEffect(() => {
    titleRef.current = title;
  }, [title]);

  const { user } = useAuth();

  // Fetch draft data when postId exists
  const { data, refetch, isFetching } = useQuery({
    queryKey: [`content`, query.postId],
    queryFn: async () => {
      const res = await fetch(`/api/post/${query.postId}/draft`);
      if (!res.ok) throw new Error("Failed to fetch draft");
      return res.json();
    },
    enabled: !!query.postId,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  // Update state when data is loaded or postId changes
  useEffect(() => {
    if (id || query.postId) {
      // Set content
      if (data && data.post.content) {
        setContent(data.post.content);
      }

      // Set title
      if (data && data.post.title) {
        setTitle(data.post.title);
      }

      // Set storyId

      // Force TextEditor remount with new data
      setEditorKey(Date.now());
    }
  }, [data, id, query.postId]);

  // Reset state when navigating to new editor (no postId)
  useEffect(() => {
    if (!id || !query.postId) {
      setContent(initContent || null);
      setTitle("");
      setStoryId(null);
      setEditorKey(Date.now());
    }
  }, [id, query.postId, initContent]);

  const onSubmitDraft = async (output) => {
    if (data && data.post.status === "published") return;
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    // Prevent concurrent saves
    if (isSubmittingRef.current && isLoading) {
      return;
    }
    try {
      isSubmittingRef.current = true;
      setIsLoading(true);
      setIsDraft(true);
      setIsSaving(true);

      if (isCreatingRef.current) return;
      // Get the latest title from ref to avoid stale closure
      const currentTitle = titleRef.current;
      const currentContent = output || content;

      const payload = {
        title: currentTitle,
        content: currentContent,
        status: "draft",
      };

      // Only include postId if it exists
      if (id || query.postId || storyId) {
        payload.postId = id || query.postId || storyId;
      } else {
        isCreatingRef.current = true;
      }

      const res = await fetch("/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || "Failed to save draft");
      }

      // Update storyId and URL if this is a new post
      if (!query.postId && responseData.id) {
        setStoryId(responseData.id);
        replace(`/editor/${responseData.id}`, undefined, {
          shallow: true,
        });
        // setTimeout(() => {
        //   isSubmittingRef.current = false;
        // }, 1000);
      }

      // // Invalidate and refetch the query
      await queryClient.invalidateQueries([
        `content`,
        responseData.id || query.postId,
      ]);

      // setIsDraft(false);
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error(error.message || "Failed to save draft");
      setIsDraft(false);
      setIsSaving(false);
    } finally {
      setIsLoading(false);
      isSubmittingRef.current = false;
      // setTimeout(() => setIsSaving(false), 100);
    }
  };
  const onSavePublish = async () => {
    if (data && data.post.status !== "published") return;

    try {
      setPublishLoading(true);

      const currentTitle = titleRef.current;
      const currentContent = content;

      const payload = {
        title: currentTitle,
        content: currentContent,
      };

      const res = await fetch(`/api/post/${query.postId}/save-publish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || "Failed to save publish");
      }
      toast.success("Successfully Saved");
    } catch (error) {
      setPublishLoading(false);
      console.error("Error saving draft:", error);
      toast.error(error.message || "Failed to save publish");
    } finally {
      setPublishLoading(false);
    }
  };

  const clearEditor = () => {
    setTitle("");
    setContent(null);
    if (editor) {
      editor?.clear();
    }
  };
  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-4rem)]">
      <header className="py-3 sm:py-4 px-3 sm:px-5 md:px-7 w-full sm:w-11/12 md:w-10/12 mx-auto border-b flex items-center justify-between sticky top-14 sm:top-16 z-10 bg-background">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <h1 className="font-headline text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-1 truncate">
            <span className="hidden sm:inline">
              {query.postId ? "Edit Post" : "New Post"}
            </span>
            <span className="sm:hidden">{query.postId ? "Edit" : "New"}</span>
            {isDraft && (
              <span className="text-muted-foreground/80 ml-1.5 sm:ml-2.5 mr-1 text-xs sm:text-sm font-normal hidden md:inline">
                saved to draft
              </span>
            )}
            {isDraft && (
              <span className="text-muted-foreground/80 ml-1 text-xs font-normal md:hidden">
                saved
              </span>
            )}
            {(isLoading || isFetching) && <Spinner className="h-4 w-4" />}
          </h1>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm"
                disabled={
                  !title || !isObject(content) || !content.blocks?.length
                }
              >
                <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline ml-1.5">Preview</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] sm:w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl h-[90vh] flex flex-col p-0">
              <DialogHeader className="p-4 sm:p-6 border-b">
                <DialogTitle className="text-base sm:text-lg">
                  Post Preview
                </DialogTitle>
              </DialogHeader>
              <div className="flex-grow overflow-y-auto prose dark:prose-invert sm:prose-lg lg:prose-xl w-full px-3 sm:px-4 md:px-6 py-3 sm:py-4 n-scroll">
                <h1 className="font-headline font-bold text-xl sm:text-2xl md:text-3xl">
                  {title || "Your Post Title"}
                </h1>
                <div className="flex items-center gap-3 sm:gap-4 mt-3 sm:mt-4.5 mb-3 sm:mb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                      <AvatarImage src={user?.profileImage} alt="User" />
                      <AvatarFallback className="text-xs sm:text-sm">
                        {user?.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-xs sm:text-sm not-prose mb-1 sm:mb-1.5">
                        {user?.name}
                      </p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground not-prose">
                        Author
                      </p>
                    </div>
                  </div>
                </div>

                <div className="post">
                  <TextEditor initialData={content} readOnly />
                </div>
              </div>
            </DialogContent>
          </Dialog>
          {data && data.post.status === "published" ? (
            <Button
              disabled={
                !id ||
                !title ||
                !isObject(content) ||
                !content.blocks?.length ||
                publishLoading
              }
              size="sm"
              className="bg-green-600 text-green-100 hover:bg-green-600 hover:text-green-100 h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm whitespace-nowrap"
              onClick={onSavePublish}
            >
              <span className="hidden sm:inline">Saved To Publish</span>
              <span className="sm:hidden">Saved</span>
              {publishLoading && <Spinner className="ml-1 h-3.5 w-3.5" />}
            </Button>
          ) : (
            <Dialog
              open={isOpenPublishModal}
              onOpenChange={setIsOpenPublishModal}
            >
              <DialogTrigger asChild>
                <Button
                  disabled={
                    !id ||
                    !title ||
                    !isObject(content) ||
                    !content.blocks?.length
                  }
                  size="sm"
                  className="bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800 h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm"
                >
                  Publish
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] sm:w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl h-[95vh] flex flex-col p-0">
                <PublishingModal
                  title={title}
                  content={content}
                  storyId={storyId || query.postId}
                  onClose={() => {
                    setIsOpenPublishModal(false);
                  }}
                  clear={clearEditor}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </header>
      <div className="flex-grow container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        <div className="w-full sm:w-11/12 md:w-10/12 mx-auto space-y-4 sm:space-y-6">
          <Textarea
            placeholder="Post Title..."
            className="text-2xl sm:text-3xl md:text-4xl font-headline font-bold p-2 border-0 focus-visible:ring-0 shadow-none focus-visible:outline-0 w-full resize-none !bg-transparent leading-[1.4] sm:leading-[1.6] min-h-[60px] sm:min-h-[80px]"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => onSubmitDraft(content)}
            dir="auto"
            rows={1}
          />

          <TextEditor
            key={editorKey}
            initialData={content}
            onChange={setContent}
            id={storyId || query.postId}
            onDraft={onSubmitDraft}
            title={title}
            setEditor={setEditor}
            placeholder="Start writing your masterpiece..."
            isPublish={isOpenPublishModal}
            saveTimeoutRef={saveTimeoutRef}
          />
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
