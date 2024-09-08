const express=require("express");
const app=express();
const port=3000;
const path=require("path");
const Chat=require("./models/chat.js");
const methodOverride=require("method-override");

app.use(express.urlencoded({extended:true}));

const mongoose = require('mongoose');

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"/public/css")));
app.use(methodOverride("_method"));

main().then(()=>{
    console.log("Connection is successful.");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

//index route
app.get("/chats",async(req,res)=>{
    let chats= await Chat.find();
    res.render("index.ejs",{chats});
})

//new chat route
app.get("/chats/new",(req,res)=>{
    res.render("newChat.ejs")
})

app.post("/chats",(req,res)=>{
    let{from,to,msg}=req.body;
    let newChat=new Chat({
        from:from,
        msg:msg,
        to:to,
        created_at:new Date()
    });
    newChat.save().then(()=>{
        console.log("Chat was saved.");
    }).catch((err)=>{
        console.log(err);
    })
    res.redirect("/chats");
})

//edit route
app.get("/chats/:id/edit",async(req,res)=>{
    let {id}=req.params;
    let chat=await Chat.findById(id);
    res.render("edit.ejs",{chat});

})

//update route
app.put("/chats/:id",async(req,res)=>{
    let{id}=req.params;
    let {msg:newMsg}=req.body;
    console.log(newMsg);
    let updatedChat= await Chat.findByIdAndUpdate(id,{msg:newMsg},{runValidators:true,new:true});
    console.log(updatedChat);
    res.redirect("/chats");
})

//delete route
app.delete("/chats/:id",async(req,res)=>{
    let {id}=req.params;
    let deletedChat=await Chat.findByIdAndDelete(id);
    console.log(deletedChat);
    res.redirect("/chats");
})


app.get("/",(req,res)=>{
    res.send("Hi am working...");
})

app.listen(port,()=>{
    console.log("Server is listening you....");
})