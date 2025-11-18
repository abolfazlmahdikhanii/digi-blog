import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud, Settings, Eye, Trash2 } from "lucide-react";
import EditorPage from "..";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
export default function EditPostPage() {
  const { query } = useRouter();


  return <EditorPage id={query.postId}  />;
}
