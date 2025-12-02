import path from "path";
import express, { Express } from "express";
import { User } from "./models/User";
import mongoose, { Connection } from "mongoose";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

const mongoDB: string = "mongodb://127.0.0.1:27017/testdb";
mongoose.connect(mongoDB);
mongoose.Promise = Promise;
const db: Connection = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

export type TUser = {
  name: string;
  todos: string[];
};

let users: TUser[] = [];

// Add todo
app.post("/add", (req, res) => {
  const { name, todo } = req.body;

  if (!name || !todo) {
    return res.status(400).send("Name and todo are required.");
  }

  let user = users.find((u) => u.name === name);

  if (user) {
    user.todos.push(todo);
  } else {
    users.push({ name, todos: [todo] });
  }

  res.send(`Todo added successfully for user ${name}.`);
});

// Fetch todos
app.get("/todos/:id", (req, res) => {
  const name = req.params.id;

  const user = users.find((u) => u.name === name);

  if (!user) return res.status(404).send("User not found");

  res.json(user.todos);
});

// Delete user
app.delete("/delete", (req, res) => {
  const { name } = req.body;

  const index = users.findIndex((u) => u.name === name);

  if (index === -1) return res.status(404).send("User not found");

  users.splice(index, 1);

  res.send("User deleted successfully.");
});

// Delete single todo
app.put("/update", (req, res) => {
  const { name, todoIndex } = req.body;

  const user = users.find((u) => u.name === name);

  if (!user) return res.status(404).send("User not found");

  if (todoIndex < 0 || todoIndex >= user.todos.length) {
    return res.status(400).send("Invalid todo index.");
  }

  user.todos.splice(todoIndex, 1);

  res.send("Todo deleted successfully.");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
