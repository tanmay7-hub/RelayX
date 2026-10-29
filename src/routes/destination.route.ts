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
    if(typeof error === "object" && error != null && "code" in error && error.code === "23505"){
        return res.status(409).json({
            error:"DESTINATION_ALREADY_EXISTS",
            message : "This destination URL is already registered"
        })
    }
    return res.status(500).json({
      error: "DESTINATION_REGISTRATION_FAILED",
      message: "The destination could not be registered.",
      details : error
    });
  }
});
router.get("/:id" , async(req,res)=>{
      const destinationId = req.params.id;
      const customerId = "00000000-0000-4000-8000-000000000001";
  try{
      const {id} = req.params;

      if(!id){
        return res.status(400).json({
            error: "INVALID_INPUT",
            message : "Id is not provided"
        });
      }
      
      const query = `select id , customer_id , is_active , created_at ,url from destination where id = $1 and customer_id = $2 `;
      const result = await pool.query(query , [destinationId , customerId]);

      if(result.rows.length == 0 ){
        return res.status(400).json({
           error : "DESTINATION_NOT_FOUND",
           message : "destination not found"
        });
      }

      return res.status(200).json({
        destination : result.rows[0]
      });
  }catch(error){
        return res.status(500).json({
            error : "DESTINATION_RETRIEVAL_FAILED ",
            message : "unable to retrieve the Destination. "
        });
  }
});
router.get("/" , async(req , res)=>{
    const customerId = "00000000-0000-4000-8000-000000000001";
    try{
        const query = `select id , customer_id , is_active , url , created_at from destination where customer_id = $1 order by created_at`;

        const result = await pool.query(query ,[customerId]);

        
        return res.status(200).json({
            destinations : result.rows
        });

    }catch(error){
        return res.status(500).json({
            error : "DESTINATION_RETRIEVAL_FAILED ",
            message : "unable to retrieve the Destination. "
        })
    }
});
router.patch("/:id/disable",async(req , res)=>{
  const destinationId = req.params.id;
  const customerId = "00000000-0000-4000-8000-000000000001";
  try{
    const query = `UPDATE destination  SET is_active = false where id = $1 
                   and customer_id = $2 
                   returning id , customer_id , url , is_active , created_at`;

    const result = await pool.query(query , [destinationId , customerId]);

    if(result.rows.length === 0){
        return res.status(404).json({
            error :"DESTINATION_NOT_FOUND",
            message : "destination not found"
        });
    }
    return res.status(200).json({
         message : "Destination disabled successfully",
         destination : result.rows[0]
    });
  }catch(error){
    return res.status(500).json({
        error : "DESTINATION_UPDATE_FAILED",
        message : "Unable to disable the destination"
    });
  }
});
router.patch("/:id/enable" , async(req , res)=>{
const destinationId = req.params.id;
  const customerId = "00000000-0000-4000-8000-000000000001";
  try{
    const query = `UPDATE destination  SET is_active = true where id = $1 
                   and customer_id = $2 
                   returning id , customer_id , url , is_active , created_at`;

    const result = await pool.query(query , [destinationId , customerId]);

    if(result.rows.length === 0){
        return res.status(404).json({
            error :"DESTINATION_NOT_FOUND",
            message : "destination not found"
        });
    }
    return res.status(200).json({
         message : "Destination enabled successfully",
         destination : result.rows[0]
    });
  }catch(error){

    return res.status(500).json({
        error : "DESTINATION_UPDATE_FAILED",
        message : "Unable to enable the destination"
    });
  }
});

router.post("/:id/subscriptions" , async(req , res)=>{
  try{

  }catch(error){

  }
});
export default router;
