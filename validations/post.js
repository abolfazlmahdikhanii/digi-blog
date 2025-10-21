// ✅ Correct import
import { z } from "zod";

// ✅ Fixed schema definition
const postSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  content: z.any(), // or z.string() if content is a string
  shortDescription: z.string().min(1, "Description is required"),
  tags: z.array(z.string()).optional().default([]), // Specify array type
  postCover: z.string(),
  status: z.enum(["draft", "published"]).default("draft") // Better to use enum
});

export default postSchema;