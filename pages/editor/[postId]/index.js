import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud, Settings, Eye, Trash2 } from "lucide-react";

export default function EditPostPage({ params }) {
  const postTitle = "Mastering the Art of Modern Web Design";
  
  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-4rem)]">
      <header className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-4">
            <h1 className="font-headline text-2xl font-bold truncate">Editing Post</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
            <Trash2 className="h-5 w-5" />
          </Button>
          <Button variant="ghost">
            <Eye className="mr-2 h-4 w-4" /> Preview
          </Button>
          <Button variant="outline">Save Changes</Button>
          <Button>Publish Updates</Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="space-y-2">
             <div
              className="relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card p-6 text-center text-muted-foreground transition-colors hover:border-primary hover:bg-accent"
            >
              <img src="https://picsum.photos/seed/3/1200/630" alt="Cover" className="absolute inset-0 w-full h-full object-cover rounded-lg opacity-30" />
              <div className="relative z-10">
                <UploadCloud className="h-8 w-8 mx-auto" />
                <span className="mt-2 text-sm font-medium">
                  Click to change cover image
                </span>
                <span className="text-xs block">
                  (Recommended: 1600x840)
                </span>
              </div>
            </div>
            <input id="cover-image" type="file" className="sr-only" />
          </div>

          <Input
            defaultValue={postTitle}
            className="text-3xl md:text-4xl font-headline font-bold h-auto p-2 border-0 focus-visible:ring-0 shadow-none"
          />

          <Textarea
            defaultValue="A comprehensive guide to the principles of contemporary web design, focusing on user experience, minimalism, and performance..."
            className="min-h-[50vh] text-lg p-2 border-0 focus-visible:ring-0 shadow-none resize-none"
          />
        </div>
      </div>
    </div>
  );
}
