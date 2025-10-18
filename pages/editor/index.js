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

// Import editor dynamically with no SSR
const TextEditor = dynamic(() => import("@/components/text-editor"), {
  ssr: false,
});

export default function EditorPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState(null);

  const handleCoverImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  console.log(content);
  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-4rem)]">
      <header className="py-4 px-7 w-10/12 mx-auto border-b flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="font-headline text-2xl font-bold">New Post</h1>
        </div>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost">
                <Eye className="mr-2 h-4 w-4" /> Preview
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full min-w-4xl  h-[90vh] flex flex-col ">
              <DialogHeader>
                <DialogTitle>Post Preview</DialogTitle>
              </DialogHeader>
              <div className="flex-grow overflow-y-auto prose dark:prose-invert lg:prose-xl w-full px-2 py-4 n-scroll">
                <h1 className="font-headline font-bold">
                  {title || "Your Post Title"}
                </h1>
                <div className="flex items-center gap-4 mt-6 mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src="https://picsum.photos/seed/103/100/100"
                        alt="User"
                      />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm not-prose mb-1.5">
                        John Doe
                      </p>
                      <p className="text-xs text-muted-foreground not-prose">
                        5 min read ·{" "}
                        {new Date().toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <TextEditor initialData={content} readOnly />
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline">Save Draft</Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                
                className="bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800 "
              >
                Publish
              </Button>
            </DialogTrigger>
            <DialogContent className="min-w-4xl h-[90vh] flex flex-col">
              <PublishingModal title={title} />
            </DialogContent>
          </Dialog>
          {/* <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button> */}
        </div>
      </header>
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="w-10/12 mx-auto space-y-6">
          <input
            placeholder="Post Title..."
            className="text-3xl md:text-4xl font-headline font-bold h-auto p-2 border-0 focus-visible:ring-0 shadow-none focus-visible:outline-0 w-full"
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
