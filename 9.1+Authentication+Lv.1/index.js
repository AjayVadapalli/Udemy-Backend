import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();


const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
db.connect();
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  const checkUser = await db.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  if (checkUser.rows.length > 0) {
    res.send("User already exists");
  }else{
    const result = await db.query(
      "INSERT INTO users (email, password) VALUES ($1, $2)",
      [email, password]
    );
    console.log(result);
    res.redirect("/secrets.ejs");
  }
  
});

app.post("/login", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
