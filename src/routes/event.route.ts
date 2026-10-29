import { Router } from "express";
import { randomUUID } from "node:crypto";
import { eventSchema } from "../schemas/event.schema.js";
import { pool } from "../config/database.js";

const router = Router();

router.post("/", async (req, res) => {

    const result = eventSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            error: "INVALID_EVENT",
            message: "The event payload is invalid.",
            details: result.error.issues
        });
    }

    const eventId = randomUUID();

    try {

        const query = `
            INSERT INTO events (id, event_type, payload)
            VALUES ($1, $2, $3)
            RETURNING id, event_type, status, created_at
        `;

        const values = [
            eventId,
            result.data.event,
            result.data.data
        ];

        const dbResult = await pool.query(query, values);

        return res.status(202).json({
            message: "Event accepted.",
            event: dbResult.rows[0]
        });
    } catch (error) {
        console.error("Failed to persist event:", error);

        return res.status(500).json({
            error: "EVENT_PERSISTENCE_FAILED",
            message: "The event could not be accepted. Please try again."
        });
    }
});

router.get("/:id" , async(req, res)=>{
   const {id} = req.params;

   if(!id){
    return res.status(400).json({message : "Invalid input"});
   }
   try{
     const query = `select id , event_type , payload from events where id = $1`;

     const result = await pool.query(query , [id]);

     if(result.rows.length === 0 ){
         return res.status(404).json({
                error: "EVENT_NOT_FOUND",
                message: "No event exists with the provided ID."
            });
        }
        return res.status(200).json({event : result.rows[0]});
   }catch(error){
        return res.status(500).json({
            error: "EVENT_RETRIEVAL_FAILED",
            message: "Unable to retrieve the event."
        });

   }
});

export default router;