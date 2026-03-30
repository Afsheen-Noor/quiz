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
app.get("/questions", (req, res) => 
{
  app.get("/questions", (req, res) => {
  db.query("SELECT * FROM questions", (err, results) => {
    if (err) {
      console.log("Error:", err);
      res.status(500).send("Error fetching questions");
    } else {
      res.json(results);
    }
  });
       });
 });

    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err);

        let formatted = {};

        results.forEach(row => {
            if (!formatted[row.id]) {
                formatted[row.id] = {
                    id: row.id,
                    question: row.question_text,
                    options: []
                };
            }
            formatted[row.id].options.push(row.option_text);
        });

        res.json(Object.values(formatted));
    });



// Start server
app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running");
});
app.post("/submit", (req, res) => {
    const userAnswers = req.body.answers;

    const query = `
        SELECT q.id, o.option_text, o.is_correct
        FROM questions q
        JOIN options o ON q.id = o.question_id
        ORDER BY q.id
    `;

    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err);

        let correctAnswers = {};
        let questionOrder = [];

        // Extract correct answers
        results.forEach(row => {
            if (!questionOrder.includes(row.id)) {
                questionOrder.push(row.id);
            }

            if (row.is_correct) {
                correctAnswers[row.id] = row.option_text;
            }
        });

        // Calculate score
        let score = 0;

        userAnswers.forEach((ans, index) => {
            let qId = questionOrder[index];

            if (ans === correctAnswers[qId]) {
                score++;
            }
        });

        res.json({ score });
    });
});