import { z } from "zod";

export const subscriptionSchema = z.object({
  event_type: z.string().trim().min(1).max(200)
});