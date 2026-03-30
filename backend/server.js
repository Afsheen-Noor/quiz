const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MySQL
const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed:", err);
  } else {
    console.log("Connected to Railway MySQL");
  }
});


// ✅ API 1: Get Questions
app.get("/questions", (req, res) => {
  db.query("SELECT * FROM questions", (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error fetching questions");
    } else {
      res.json(results);
    }
  });
});



// Start server
app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running");
});
app.post("/submit", (req, res) => {
  const userAnswers = req.body.answers;

  db.query("SELECT * FROM questions", (err, results) => {
    if (err) return res.status(500).send(err);

    let score = 0;

    userAnswers.forEach((ans, index) => {
      if (ans === results[index].correct_answer) {
        score++;
      }
    });

    res.json({ score });
  });
});