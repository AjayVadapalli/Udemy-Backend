import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "123456",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function checkVisited() {
  try {
    const result = await db.query("SELECT country_code FROM visited_countries");
    return result.rows.map((row) => row.country_code);
  } catch (error) {
    console.error("Error fetching visited countries:", error);
    return [];
  }
}

// GET home page
app.get("/", async (req, res) => {
  const countries = await checkVisited();
  res.render("index.ejs", { countries: countries, total: countries.length });
});

// INSERT new country
app.post("/add", async (req, res) => {
  const input = req.body["country"];
  
  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE country_name = $1",
      [input]
    );

    if (result.rows.length === 0) {
      console.log("Country not found in database.");
      return res.redirect("/?error=CountryNotFound");
    }

    const countryCode = result.rows[0].country_code;

    await db.query(
      "INSERT INTO visited_countries (country_code) VALUES ($1) ON CONFLICT DO NOTHING",
      [countryCode]
    );

    res.redirect("/");
  } catch (error) {
    console.error("Error inserting country:", error);
    res.redirect("/?error=DatabaseError");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});