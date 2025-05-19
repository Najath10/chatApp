import express from 'express'
import "dotenv/config"
import cors from 'cors'
import http from 'http'
import { connectdb } from './lib/db.js';
import userRouter from './routes/userRouter.js';
import messageRouter from './routes/messageRoutes.js';
import { Server } from 'socket.io';



const app = express();
const server = http.createServer(app);

// Initalize socket.io server
export const io = new Server(server,{
    cors:{ origin:"*"}
});
export const userSocketMap = {}; 

io.on("connection", (socket)=>{
    const userId= socket.handshake.query.userId;
    console.log("user conected", userId);

    if(userId) userSocketMap[userId]= socket.id
    
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect",()=>{
        console.log("User Disconnected", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap))
    })
})

//Middleware setup
app.use(express.json({limit:"4mb"}))
app.use(cors());

//Routes
app.use("/api/auth", userRouter)
app.use("/api/messages", messageRouter)
await connectdb();

app.use("/api/status", (req,res)=> res.send("server is live"));
if(process.env.NODE_ENV !=="production"){
server.listen(process.env.PORT, ()=>{
    console.log(`server started running on ${process.env.PORT}`);
})
}
export default server