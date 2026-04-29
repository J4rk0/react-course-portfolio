// src/exercises/1-vanilla-todo.tsx

// 1. Definiujemy typ Todo - opisuje strukturę jednego zadania
type Todo = {
  id: number;           // unikalny identyfikator zadania
  text: string;         // treść zadania
  completed: boolean;   // czy zadanie jest ukończone
};

export function initVanillaTodo() {
  // Pobieramy element, do którego będziemy wstawiać nasze Todo
  const root = document.getElementById('vanilla-root') as HTMLDivElement;
  if (!root) return;

  // Wstawiamy cały HTML interfejsu Todo do strony
  root.innerHTML = `
    <div style="max-width: 600px; margin: 40px auto; font-family: Arial, sans-serif;">
      <h1>Vanilla Todo - Moduł 1</h1>
      
      <!-- Sekcja dodawania nowego zadania -->
      <div style="margin-bottom: 20px;">
        <input 
          type="text" 
          id="todo-input" 
          placeholder="Co trzeba zrobić?" 
          style="padding: 12px; width: 70%; font-size: 16px;"
        />
        <button id="add-btn" style="padding: 12px 20px; font-size: 16px;">Dodaj</button>
      </div>

      <!-- Przyciski filtrowania -->
      <div style="margin-bottom: 15px;">
        <button data-filter="all" class="filter-btn active">Wszystkie</button>
        <button data-filter="active" class="filter-btn">Aktywne</button>
        <button data-filter="completed" class="filter-btn">Ukończone</button>
      </div>

      <!-- Lista zadań -->
      <ul id="todo-list" style="list-style: none; padding: 0;"></ul>

      <!-- Licznik zadań -->
      <div style="margin-top: 20px; font-size: 14px; color: #666;">
        <span id="count">0</span> zadań
      </div>
    </div>
  `;

  // Pobieramy wszystkie elementy interfejsu, z którymi będziemy pracować
  const input = document.getElementById('todo-input') as HTMLInputElement;
  const addBtn = document.getElementById('add-btn') as HTMLButtonElement;
  const todoList = document.getElementById('todo-list') as HTMLUListElement;
  const countSpan = document.getElementById('count') as HTMLSpanElement;

  // Zmienne stanu aplikacji
  let todos: Todo[] = JSON.parse(localStorage.getItem('todos') || '[]');
  let currentFilter: 'all' | 'active' | 'completed' = 'all';

  // Zapisuje aktualną listę zadań do localStorage
  function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  // Renderuje listę zadań na ekranie w zależności od wybranego filtra
  function renderTodos() {
    todoList.innerHTML = '';

    // Filtrujemy zadania w zależności od aktualnego filtra
    const filteredTodos = todos.filter(todo => {
      if (currentFilter === 'active') return !todo.completed;
      if (currentFilter === 'completed') return todo.completed;
      return true; // 'all'
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

  // Dodaje nowe zadanie do listy
  function addTodo() {
    const text = input.value.trim();
    if (!text) return;

    todos.push({
      id: Date.now(),     // prosty sposób na unikalne ID
      text: text,
      completed: false
    });

    saveTodos();
    input.value = '';     // czyścimy pole tekstowe
    renderTodos();
  }

  // --- Obsługa zdarzeń (Event Listeners) ---

  // Dodawanie zadania po kliknięciu przycisku
  addBtn.addEventListener('click', addTodo);

  // Dodawanie zadania po naciśnięciu Enter w polu input
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
  });

  // Obsługa checkboxa (ukończenie zadania) oraz przycisku Usuń
  todoList.addEventListener('click', (e) => {
    const target = e.target as HTMLInputElement | HTMLButtonElement;

    // Obsługa checkboxa
    if (target.type === 'checkbox') {
      const id = parseInt(target.dataset.id!);
      const todo = todos.find(t => t.id === id);
      if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
      }
    }

    // Obsługa przycisku "Usuń"
    if (target.tagName === 'BUTTON' && target.textContent === 'Usuń') {
      const id = parseInt(target.dataset.id!);
      todos = todos.filter(t => t.id !== id);
      saveTodos();
      renderTodos();
    }
  });

  // Obsługa przycisków filtrowania (Wszystkie / Aktywne / Ukończone)
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Usuwamy klasę active ze wszystkich przycisków
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      // Dodajemy active do klikniętego przycisku
      btn.classList.add('active');

      currentFilter = (btn as HTMLButtonElement).dataset.filter as 'all' | 'active' | 'completed';
      renderTodos();
    });
  });

  // Pierwsze wyświetlenie listy zadań
  renderTodos();
}