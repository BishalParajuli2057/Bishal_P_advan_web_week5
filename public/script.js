const form = document.getElementById("todoForm");
const userInput = document.getElementById("userInput");
const todoInput = document.getElementById("todoInput");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = userInput.value.trim();
  const todo = todoInput.value.trim();

  if (!name || !todo) {
    message.textContent = "Please fill in both fields.";
    return;
  }

  try {
    const res = await fetch("/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, todo }),
    });

    const text = await res.text();
    message.textContent = text;

    if (res.ok) {
      todoInput.value = "";
    }
  } catch (err) {
    console.error(err);
    message.textContent = "Error connecting to server.";
  }
});
