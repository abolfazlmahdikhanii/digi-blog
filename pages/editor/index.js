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
      <header className="py-4 px-7 w-10/12 mx-auto border-b flex items-center justify-between sticky top-16 z-10 bg-[#09090B]">
        <div className="flex items-center gap-4">
          <h1 className="font-headline text-2xl font-bold flex items-center gap-1">
            {query.postId ? "Edit Post" : "New Post"}{" "}
            {isDraft && (
              <span className="text-muted-foreground/80 ml-2.5 mr-1 text-sm font-normal">
                saved to draft
              </span>
            )}{" "}
            {(isLoading || isFetching) && <Spinner />}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                disabled={
                  !title || !isObject(content) || !content.blocks?.length
                }
              >
                <Eye className="h-4 w-4" /> Preview
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full min-w-4xl h-[90vh] flex flex-col">
              <DialogHeader className="p-6 border-b">
                <DialogTitle>Post Preview</DialogTitle>
              </DialogHeader>
              <div className="flex-grow overflow-y-auto prose dark:prose-invert lg:prose-xl w-full px-2 py-4 n-scroll">
                <h1 className="font-headline font-bold text-lg">
                  {title || "Your Post Title"}
                </h1>
                <div className="flex items-center gap-4 mt-4.5 mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.profileImage} alt="User" />
                      <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm not-prose mb-1.5">
                        {user?.name}
                      </p>
                      <p className="text-xs text-muted-foreground not-prose">
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
              className="bg-green-600 text-green-100 hover:bg-green-600 hover:text-green-100 "
              onClick={onSavePublish}
            >
              Saved To Publish {publishLoading && <Spinner />}
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
                  className="bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800"
                >
                  Publish
                </Button>
              </DialogTrigger>
              <DialogContent className="min-w-4xl h-[95%] flex flex-col">
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
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="w-10/12 mx-auto space-y-6">
          <Textarea
            placeholder="Post Title..."
            className="text-3xl md:text-4xl font-headline font-bold p-2 border-0 focus-visible:ring-0 shadow-none focus-visible:outline-0 w-full resize-none !bg-[#09090B] leading-[1.6]"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => onSubmitDraft(content)}
            dir="auto"
          />

          <TextEditor
            key={editorKey} // Use timestamp-based key to force remount with fresh data
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
  const { token,refreshToken } = context.req.cookies;
  await connectToDB();
  if (!token&&!refreshToken) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }
  const validToken = verifyToken(token);
   const validRefreshToken = verifyRefreshToken(refreshToken);
  if (!validToken&&!validRefreshToken) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }
  const user = await usersModel.findOne({ email: validToken.email||validRefreshToken.email });
  if (!user) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }
  return { props: {} };
}
