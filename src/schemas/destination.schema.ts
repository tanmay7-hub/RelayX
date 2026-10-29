import z from "zod";

export const destinationSchema = z.object({
  url : z.url().max(2048)
});