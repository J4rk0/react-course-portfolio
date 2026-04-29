// src/exercises/1-vanilla-todo.tsx
type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

export function initVanillaTodo() {
  const root = document.getElementById('vanilla-root') as HTMLDivElement;
  if (!root) return;

  root.innerHTML = `
    <div style="max-width: 600px; margin: 40px auto; font-family: Arial, sans-serif;">
      <h1>Vanilla Todo - Moduł 1</h1>
      
      <div style="margin-bottom: 20px;">
        <input 
          type="text" 
          id="todo-input" 
          placeholder="Co trzeba zrobić?" 
          style="padding: 12px; width: 70%; font-size: 16px;"
        />
        <button id="add-btn" style="padding: 12px 20px; font-size: 16px;">Dodaj</button>
      </div>

      <div style="margin-bottom: 15px;">
        <button data-filter="all" class="filter-btn active">Wszystkie</button>
        <button data-filter="active" class="filter-btn">Aktywne</button>
        <button data-filter="completed" class="filter-btn">Ukończone</button>
      </div>

      <ul id="todo-list" style="list-style: none; padding: 0;"></ul>

      <div style="margin-top: 20px; font-size: 14px; color: #666;">
        <span id="count">0</span> zadań
      </div>
    </div>
  `;

  const input = document.getElementById('todo-input') as HTMLInputElement;
  const addBtn = document.getElementById('add-btn') as HTMLButtonElement;
  const todoList = document.getElementById('todo-list') as HTMLUListElement;
  const countSpan = document.getElementById('count') as HTMLSpanElement;

  let todos: Todo[] = JSON.parse(localStorage.getItem('todos') || '[]');
  let currentFilter: 'all' | 'active' | 'completed' = 'all';

  function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  function renderTodos() {
    todoList.innerHTML = '';

    const filteredTodos = todos.filter(todo => {
      if (currentFilter === 'active') return !todo.completed;
      if (currentFilter === 'completed') return todo.completed;
      return true; // all
    });

    filteredTodos.forEach(todo => {
      const li = document.createElement('li');
      li.style.cssText = `
        padding: 12px; 
        background: #f9f9f9; 
        margin: 8px 0; 
        border-radius: 6px; 
        display: flex; 
        align-items: center;
        gap: 12px;
      `;

      li.innerHTML = `
        <input type="checkbox" ${todo.completed ? 'checked' : ''} data-id="${todo.id}" />
        <span style="flex: 1; text-decoration: ${todo.completed ? 'line-through' : 'none'};">
          ${todo.text}
        </span>
        <button data-id="${todo.id}" style="background: #ff4d4d; color: white; border: none; padding: 6px 12px; border-radius: 4px;">Usuń</button>
      `;

      todoList.appendChild(li);
    });

    countSpan.textContent = todos.length.toString();
  }

  function addTodo() {
    const text = input.value.trim();
    if (!text) return;

    todos.push({
      id: Date.now(),
      text,
      completed: false
    });

    saveTodos();
    input.value = '';
    renderTodos();
  }

  // Event Listeners
  addBtn.addEventListener('click', addTodo);

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
  });

  todoList.addEventListener('click', (e) => {
    // const target = e.target as HTMLElement;
    const target = e.target as HTMLInputElement | HTMLButtonElement;

    if (target.type === 'checkbox') {
      const id = parseInt(target.dataset.id!);
      const todo = todos.find(t => t.id === id);
      if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
      }
    }

    if (target.tagName === 'BUTTON' && target.textContent === 'Usuń') {
      const id = parseInt(target.dataset.id!);
      todos = todos.filter(t => t.id !== id);
      saveTodos();
      renderTodos();
    }
  });

  // Filtrowanie
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // currentFilter = btn.dataset.filter as 'all' | 'active' | 'completed';
      currentFilter = (btn as HTMLButtonElement).dataset.filter as 'all' | 'active' | 'completed';
      renderTodos();
    });
  });

  renderTodos();
}