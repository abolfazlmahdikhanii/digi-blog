// ✅ Correct import
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().trim(),
  slug: z.string().trim(),
  icon: z.string().trim().optional(),
});

export default categorySchema;
