import express from "express";
import path from "path";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

type TUser = {
  name: string;
  todos: string[];
};

// In-memory storage for now (you can later connect this to a file for task 5)
let users: TUser[] = [];

// Route to add todo
app.post("/add", (req, res) => {
  const { name, todo } = req.body as { name?: string; todo?: string };

  if (!name || !todo) {
    return res.status(400).send("Name and todo are required.");
  }

  // Check if user already exists
  let user = users.find((u) => u.name === name);

  if (user) {
    // Append todo to existing user
    user.todos.push(todo);
  } else {
    // Create new user
    const newUser: TUser = {
      name,
      todos: [todo],
    };
    users.push(newUser);
  }

  // Response text must match assignment
  res.send(`Todo added successfully for user ${name}.`);
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
