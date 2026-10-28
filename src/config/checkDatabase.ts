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

// import "dotenv/config";
// import pg from "pg";

// const { Client } = pg;

// const client = new Client({
//     connectionString: process.env.DATABASE_URL
// });

// try {
//     await client.connect();

//     const result = await client.query(`
//         SELECT
//             current_database() AS database,
//             current_user AS username,
//             inet_server_addr() AS server_address,
//             inet_server_port() AS server_port
//     `);

//     console.log("Connected successfully:", result.rows[0]);
// } catch (error) {
//     console.error("Connection failed:", error);
// } finally {
//     await client.end().catch(() => {});
// }