import express from "express";

const app = express();
const port = 3000;

app.get("/",(req,res) =>{
    res.send("<h1>Hello</h1>");
});

app.get("/about",(req,res) =>{
    res.send("<h1>About me</h1>");
});

app.get("/contact",(req,res) =>{
    res.send("<h1>my contact</h1>");
});

app.listen(port , () => {
    console.log(`Server is running at port ${port}`);
});