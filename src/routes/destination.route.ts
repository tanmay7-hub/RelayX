import { pool } from "../config/database.js";
import { randomUUID } from "node:crypto";
import { destinationSchema } from "../schemas/destination.schema.js";
import { Router } from "express";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const result = destinationSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: "INVALID_DESTINATION",
        message: "The destination url is not valid",
        details: result.error.issues,
      });
    }
    const destinationId = randomUUID();
    const query = `Insert into destination(id , customer_id , url) 
                    values($1 , $2 , $3)
                    Returning id , customer_id , url , is_active , created_at`;

    const customerId = "00000000-0000-4000-8000-000000000001";

    const dbResult = await pool.query(query, [
      destinationId,
      customerId,
      result.data.url,
    ]);

    return res.status(201).json({
      message: "Destination registered successfully",
      destination: dbResult.rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      error: "DESTINATION_REGISTRATION_FAILED",
      message: "The destination could not be registered.",
    });
  }
});

export default router;
