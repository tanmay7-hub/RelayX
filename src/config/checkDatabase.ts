import {pool} from "./database.js";
try{
    const result = await pool.query("SELECT NOW() AS current_time");
    console.log("postgres connected successfully");
    console.log(result.rows);
}catch(err){
    console.log("postgres connection failed");
    console.log(err);
    process.exitCode = 1; 
}finally{
    await pool.end();
}


