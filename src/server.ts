import app from "./app.js"
import  "./config/redis.js"
const port = Number(process.env.PORT) || 3000;


app.listen(port , ()=>{
   console.log(`App is running on  port ${port}`);
});