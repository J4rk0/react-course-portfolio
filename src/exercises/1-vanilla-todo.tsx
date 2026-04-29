// src/exercises/1-vanilla-todo.tsx
// Proste Todo List w czystym TypeScript + DOM (bez Reacta)

export function initVanillaTodo() {
  // Pobieramy główny element, do którego wrzucimy nasze Todo
  // const app = document.getElementById('root') as HTMLDivElement;
  const app = document.getElementById('vanilla-root') as HTMLDivElement;
  if (!app) return;

  // Czyścimy zawartość roota (żeby nie nakładało się na Vite template)
  app.innerHTML = `
    <div style="max-width: 500px; margin: 40px auto; font-family: Arial, sans-serif;">
      <h2>Vanilla Todo (Moduł 1)</h2>
      
      <div style="margin-bottom: 20px;">
        <input 
          type="text" 
          id="todo-input" 
          placeholder="Co trzeba zrobić?" 
          style="padding: 10px; width: 70%; font-size: 16px;"
        />
        <button 
          id="add-btn"
          style="padding: 10px 20px; font-size: 16px;"
        >
          Dodaj
        </button>
      </div>

      <ul id="todo-list" style="list-style: none; padding: 0;"></ul>

      <div style="margin-top: 20px; font-size: 14px; color: #666;">
        <span id="count">0</span> zadań
      </div>
    </div>
  `;

  // Pobieramy elementy z HTML-a
  const input = document.getElementById('todo-input') as HTMLInputElement;
  const addBtn = document.getElementById('add-btn') as HTMLButtonElement;
  const todoList = document.getElementById('todo-list') as HTMLUListElement;
  const countSpan = document.getElementById('count') as HTMLSpanElement;

  // Ładujemy zadania z localStorage
  let todos: string[] = JSON.parse(localStorage.getItem('todos') || '[]');

  // Funkcja renderująca listę zadań
  function renderTodos() {
    todoList.innerHTML = '';

    todos.forEach((todo, index) => {
      const li = document.createElement('li');
      li.style.cssText = 'padding: 12px; background: #f9f9f9; margin: 6px 0; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;';

      li.innerHTML = `
        <span>${todo}</span>
        <button data-index="${index}" style="background: #ff4d4d; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">
          Usuń
        </button>
      `;

      todoList.appendChild(li);
    });

    countSpan.textContent = todos.length.toString();
  }

  // Dodawanie nowego zadania
  function addTodo() {
    const text = input.value.trim();
    if (text === '') return;

    todos.push(text);
    localStorage.setItem('todos', JSON.stringify(todos));

    input.value = '';        // czyścimy input
    renderTodos();           // odświeżamy listę
  }

  // Usuwanie zadania
  function deleteTodo(index: number) {
    todos.splice(index, 1);
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos();
  }

  // Obsługa kliknięcia przycisku "Dodaj"
  addBtn.addEventListener('click', addTodo);

  // Obsługa Enter w polu input
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
  });

  // Obsługa kliknięcia w przycisk "Usuń" (delegacja zdarzeń)
  todoList.addEventListener('click', (e) => {
    const target = e.target as HTMLButtonElement;
    if (target.tagName === 'BUTTON') {
      const index = parseInt(target.dataset.index || '0');
      deleteTodo(index);
    }
  });

  // Pierwsze wyświetlenie listy
  renderTodos();
}
