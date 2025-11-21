// ADD TODO
document.getElementById("todoForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("userInput").value.trim();
  const todo = document.getElementById("todoInput").value.trim();
  const message = document.getElementById("message");

  const res = await fetch("/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, todo }),
  });

  const text = await res.text();
  message.textContent = text;

  document.getElementById("userInput").value = "";
  document.getElementById("todoInput").value = "";
});

// SEARCH USER
document.getElementById("searchForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("searchInput").value.trim();
  const message = document.getElementById("searchMessage");
  const todoList = document.getElementById("todoList");
  const deleteBtn = document.getElementById("deleteUser");

  todoList.innerHTML = "";
  deleteBtn.style.display = "none";

  const res = await fetch(`/todos/${name}`);
  const data = await res.text();

  if (!res.ok) {
    message.textContent = data;
    return;
  }

  const todos = JSON.parse(data);

  message.textContent = `Todos for ${name}:`;

  window.currentUser = name;

  deleteBtn.style.display = "block";

  todos.forEach((todo, i) => {
    const li = document.createElement("li");
    const a = document.createElement("a");

    a.textContent = todo;
    a.href = "#";
    a.dataset.index = i;
    a.classList.add("delete-task");

    li.appendChild(a);
    todoList.appendChild(li);
  });
});

// DELETE WHOLE USER
document.getElementById("deleteUser").addEventListener("click", async () => {
  const name = window.currentUser;

  const res = await fetch("/delete", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  const text = await res.text();
  document.getElementById("searchMessage").textContent = text;

  document.getElementById("todoList").innerHTML = "";
  document.getElementById("deleteUser").style.display = "none";
});

// DELETE SINGLE TODO
document.getElementById("todoList").addEventListener("click", async (e) => {
  if (!e.target.classList.contains("delete-task")) return;

  const index = Number(e.target.dataset.index);
  const name = window.currentUser;

  const res = await fetch("/update", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, todoIndex: index }),
  });

  const text = await res.text();
  document.getElementById("searchMessage").textContent = text;

  // Refresh list automatically
  document.getElementById("searchForm").dispatchEvent(new Event("submit"));
});
