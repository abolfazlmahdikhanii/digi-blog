// ✅ Correct import
import { z } from "zod";

const topicSchema = z.object({
  name: z.string().trim().min(2),
});

export default topicSchema;
