import express from "express";

const app = express();
const PORT = 3000;

// REQUIRED for CodeGrade
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

// Task requirement
app.get("/hello", (req, res) => {
  res.json({
    msg: "Hello world!",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
