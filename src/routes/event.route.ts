import { Router } from "express";
import {randomUUID} from "node:crypto"
import { eventSchema } from "../schemas/event.schema.js";
const router = Router();

router.post("/", (req, res) => {
  const result = eventSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "INVALID_EVENT",
      message: "The event payload is invalid.",
      details: result.error.issues,
    });
  }
  const eventId = randomUUID();

  return res.status(202).json({
    message: "Event accepted.",
    eventId,
    status: "accepted",
  });
});

export default router;
