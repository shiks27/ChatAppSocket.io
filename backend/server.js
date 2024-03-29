const express=require("express");
const { chats } = require("./data/data")
const dotenv=require("dotenv");
const connectDB = require("./Config/db");
// const colors = require("colors");
const userRoutes=require("./routes/userRoutes");
const chatRoutes=require("./routes/chatRoutes");
const messageRoutes=require("./routes/messageRoutes");
const {notFound,errorHandler}=require("./MiddleWare/errorMiddleWare");


const app=express();
dotenv.config();
connectDB();

app.use(express.json());   //to accept json data

// app.get("/",(req,res)=>{
//     res.send("API is running Successfully!")
// });

app.use("/api/user",userRoutes);
app.use("/api/chat",chatRoutes);
app.use("/api/message",messageRoutes);

app.use(notFound);
app.use(errorHandler);

// app.get("/api/chat",(req,res)=>{
//     res.send(chats);
// })


const PORT=process.env.PORT||5000;
const server=app.listen(5000,console.log(`Server started on port ${PORT}`));

const io=require("socket.io")(server,{
    pingTimeOut:60000,
    cors:{
        origin:"http://localhost:3000",
    }
});
io.on("connection",(socket)=>{
    console.log("Connected to socket.io");

    socket.on("setup",(userData)=>{
        socket.join(userData._id);
        socket.emit("connected");
    });
    socket.on("join chat",(room)=>{
        socket.join(room);
        console.log("User Joined Room: "+room);
    })

    socket.on("typing",(room)=>socket.in(room).emit("typing"));
    socket.on("stop typing",(room)=>socket.in(room).emit("Stop Typing"));

    socket.on("newMessage",(newMessageReceived)=>{
        var chat=newMessageReceived.chat;
        if(!chat.users)return console.log("chat.users not defined");
        chat.users.forEach((user)=>{
            if(user._id==newMessageReceived.sender._id)return;
            socket.in(user._id).emit("Message Received",newMessageReceived);
        })
    })

    socket.off("setup",()=>{
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});