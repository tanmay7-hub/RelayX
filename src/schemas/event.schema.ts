import z from "zod"

export const eventSchema = z.object({
    event : z.string().trim().min(1).max(500),
    data : z.record(z.string() , z.unknown())
});


