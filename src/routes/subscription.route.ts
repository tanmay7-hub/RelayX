import {Router} from "express";
import {pool } from "../config/database.js";
import {randomUUID} from "node:crypto";
import {subscriptionSchema} from "../schemas/subscription.schema.js";


const router = Router();


router.post("/:id/subscription" , async(req, res)=>{
  const result = subscriptionSchema.safeParse(req.body);

  if(!result.success){
    return res.status(400).json({
          error: "Invalid subscription data",
         details: result.error.issues
    });
  }

  const destinationId = req.params.id;
  const { event_type } = result.data;
  const customerId = "00000000-0000-4000-8000-000000000001";
  try{
    const destination = await pool.query(
      `SELECT id FROM destinations
       WHERE id = $1 AND customer_id = $2`,
      [destinationId, customerId]
    );

    if(destination.rows.length === 0 ){
      return res.status(404).json({
        error: "Destination not found"
      });
    }

    const subscriptionId = randomUUID();


    const subscription = await pool.query(
        `INSERT INTO subscriptions(id , destination_id , event_type)
        values($1 , $2 , $3)
        on conflict(destination_id , event_type) DO NOTHING
        RETURNING *`,
        [subscriptionId , destinationId , event_type]
    );

    if(subscription.rowCount == 0){
        return res.status(409).json({
            error : "This destination is already subscribed to this event"
        });
    }

    return res.status(201).json({
        message : "Subscriptions created successfully",
        subscription: subscription.rows[0]
    });
  }catch(error){

    return res.status(500).json({
       error : "Internal server error"
    });
  }

});


export default router;