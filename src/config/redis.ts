import {Redis} from "ioredis";

const redis  = new Redis({
    host : "127.0.0.1",
    port : 6379
});


redis.on("connect" , ()=>{
  console.log("redis connected ");
});

redis.on("error",(err : any)=>{
  console.log("Error occurred in redis\n" , err);
});



// async function testRedis(){

//     await redis.set("relayx:tanmay" , "joshi" );

//     const res = await redis.get("relayx:tanmay");
//     console.log(res);
// }

// testRedis();

export default redis;