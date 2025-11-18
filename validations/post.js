// ✅ Correct import
import { z } from "zod";

// ✅ Fixed schema definition
const postSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters"),
  content: z.any(), // or z.string() if content is a string
  shortDescription: z.string().trim().min(1, "Description is required"),

  readTime: z.number().optional(),
  isShowComment: z.number().optional().default(1),
});

export default postSchema;
