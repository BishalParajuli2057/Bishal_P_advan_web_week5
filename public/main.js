document
  .getElementById("todoForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("userInput").value.trim();
    const todo = document.getElementById("todoInput").value.trim();
    const messageEl = document.getElementById("message");

    if (!name || !todo) {
      messageEl.textContent = "Please enter both name and todo.";
      return;
    }

    try {
      const res = await fetch("/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, todo }),
      });

      const text = await res.text();
      messageEl.textContent = text;

      if (res.ok) {
        document.getElementById("userInput").value = "";
        document.getElementById("todoInput").value = "";
      }
    } catch (err) {
      messageEl.textContent = "Error: " + err.message;
    }
  });
