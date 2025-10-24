import { useState } from "react";
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

// Import editor dynamically with no SSR
const TextEditor = dynamic(() => import("@/components/text-editor"), {
  ssr: false,
});

export default function EditorPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(null);
 const {user}=useAuth()
  const [isOpenPublishModal, setIsOpenPublishModal] = useState(false);



  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-4rem)]">
      <header className="py-4 px-7 w-10/12 mx-auto border-b flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="font-headline text-2xl font-bold">New Post</h1>
        </div>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                disabled={
                  !title || !isObject(content) || !content.blocks.length
                }
              >
                <Eye className=" h-4 w-4" /> Preview
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full min-w-4xl  h-[90vh] flex flex-col ">
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
                      <AvatarImage
                        src={user?.profileImage}
                        alt="User"
                      />
                      <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
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

                <TextEditor initialData={content} readOnly />
              </div>
            </DialogContent>
          </Dialog>

          <Dialog
            open={isOpenPublishModal}
            onOpenChange={setIsOpenPublishModal}
          >
            <DialogTrigger asChild>
              <Button
                disabled={
                  !title || !isObject(content) || !content.blocks.length
                }
                className="bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800 "
              >
                Publish
              </Button>
            </DialogTrigger>
            <DialogContent className="min-w-4xl h-[95%] flex flex-col">
              <PublishingModal
                title={title}
                content={content}
                onClose={() => {
                  setIsOpenPublishModal(false);
                  setTitle("");
                  setContent({});
                }}
              />
            </DialogContent>
          </Dialog>
          {/* <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button> */}
        </div>
      </header>
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="w-10/12 mx-auto space-y-6">
          <Textarea
            placeholder="Post Title..."
            className="text-3xl md:text-4xl font-headline font-bold  p-2 border-0 focus-visible:ring-0 shadow-none focus-visible:outline-0 w-full  resize-none !bg-[#09090B] leading-[1.6]"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          
          />

          <TextEditor
            initialData={content}
            onChange={setContent}
            placeholder="Start writing your masterpiece..."
          />
        </div>
      </div>
    </div>
  );
}
