import { createServer } from "node:http";

const server = createServer((req , res)=>{
    res.writeHead(200, {
        "Content-Type" : "text/plain" 
    });

    res.end("Welcome to RelayX");
});


server.listen(3000 , ()=>{
    console.log("RelayX is listening on port 3000");
});