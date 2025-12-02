import express from "express";
import path from "path";
import mongoose from "mongoose";
import { User } from "./models/User";

const app = express();
const PORT = 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

const mongoDB: string = "mongodb://127.0.0.1:27017/testdb";

mongoose
  .connect(mongoDB)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// =======================
//  POST /add  (Task 1)
// =======================
app.post("/add", async (req, res) => {
  try {
    const { name, todo } = req.body;

    if (!name || !todo) {
      return res.status(400).send("Name and todo are required.");
    }

    // Find existing user
    let user = await User.findOne({ name });

    if (!user) {
      // Create new user with first todo
      user = new User({
        name,
        todos: [{ todo }],
      });
    } else {
      // Add todo to existing user
      user.todos.push({ todo });
    }

    await user.save();

    res.send(`Todo added successfully for user ${name}.`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding todo.");
  }
});

// ===========================
//  GET /todos/:name
//  (used by frontend search)
// ===========================
app.get("/todos/:name", async (req, res) => {
  try {
    const name = req.params.name;
    const user = await User.findOne({ name });

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Frontend expects an array of strings, not objects
    const todosAsStrings = user.todos.map((t) => t.todo);
    res.send(JSON.stringify(todosAsStrings));
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching todos.");
  }
});

// =======================
//  DELETE /delete (user)
// =======================
app.delete("/delete", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).send("Name is required.");
    }

    const result = await User.deleteOne({ name });

    if (result.deletedCount === 0) {
      return res.status(404).send("User not found");
    }

    res.send("User deleted successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting user.");
  }
});

// ======================================
//  PUT /update – delete single todo item
// ======================================
app.put("/update", async (req, res) => {
  try {
    const { name, todoIndex } = req.body;

    if (typeof name !== "string" || todoIndex === undefined) {
      return res.status(400).send("Name and todoIndex are required.");
    }

    const index = Number(todoIndex);

    if (isNaN(index)) {
      return res.status(400).send("Invalid todo index.");
    }

    const user = await User.findOne({ name });

    if (!user) {
      return res.status(404).send("User not found");
    }

    if (index < 0 || index >= user.todos.length) {
      return res.status(400).send("Invalid todo index.");
    }

    user.todos.splice(index, 1);
    await user.save();

    res.send("Todo deleted successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting todo.");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
