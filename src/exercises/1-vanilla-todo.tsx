import { useEffect } from "react";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

export default function VanillaTodo() {
  useEffect(() => {
    const root = document.getElementById("vanilla-root");
    if (!root) return;

    let todos: Todo[] = JSON.parse(
      localStorage.getItem("todos") || "[]"
    );

    let filter: "all" | "active" | "completed" = "all";

    root.innerHTML = `
      <div>
        <h2>Vanilla Todo</h2>
        <input id="todo-input" placeholder="Add todo..." />
        <button id="add-btn">Add</button>

        <div style="margin-top:10px;">
          <button data-filter="all">All</button>
          <button data-filter="active">Active</button>
          <button data-filter="completed">Completed</button>
        </div>

        <ul id="todo-list"></ul>
      </div>
    `;

    const input = document.getElementById("todo-input") as HTMLInputElement;
    const list = document.getElementById("todo-list") as HTMLUListElement;

    function save() {
      localStorage.setItem("todos", JSON.stringify(todos));
      render();
    }

    function render() {
      list.innerHTML = "";

      let filtered = todos;

      if (filter === "active") {
        filtered = todos.filter((t) => !t.completed);
      } else if (filter === "completed") {
        filtered = todos.filter((t) => t.completed);
      }

      filtered.forEach((todo) => {
        const li = document.createElement("li");

        const span = document.createElement("span");
        span.textContent = todo.text;
        span.style.textDecoration = todo.completed ? "line-through" : "none";
        span.style.cursor = "pointer";

        span.onclick = () => {
          todo.completed = !todo.completed;
          save();
        };

        const delBtn = document.createElement("button");
        delBtn.textContent = "X";
        delBtn.style.marginLeft = "10px";

        delBtn.onclick = () => {
          todos = todos.filter((t) => t.id !== todo.id);
          save();
        };

        li.appendChild(span);
        li.appendChild(delBtn);
        list.appendChild(li);
      });
    }

    document.getElementById("add-btn")!.onclick = () => {
      if (!input.value.trim()) return;

      todos.push({
        id: Date.now(),
        text: input.value,
        completed: false,
      });

      input.value = "";
      save();
    };

    document.querySelectorAll("[data-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        filter = btn.getAttribute("data-filter") as any;
        render();
      });
    });

    render();
  }, []);

  return <div id="vanilla-root"> </div>;
}
