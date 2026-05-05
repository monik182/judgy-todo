import { Injectable, computed, effect, signal } from '@angular/core';
import { Todo, TodoFilter, Priority } from '../../shared/models/todo.model';

const INITIAL_TODOS: Todo[] = [
  {
    id: crypto.randomUUID(),
    text: 'Build the JudgyTodos app',
    completed: false,
    createdAt: new Date(),
    priority: 'high',
  },
  {
    id: crypto.randomUUID(),
    text: 'Question life choices',
    completed: false,
    createdAt: new Date(Date.now() - 86400000),
    priority: 'medium',
  },
  {
    id: crypto.randomUUID(),
    text: 'Read Angular docs',
    completed: true,
    createdAt: new Date(Date.now() - 172800000),
    completedAt: new Date(Date.now() - 3600000),
    priority: 'low',
  },
];

const MAX_AGE = 5 * 60 * 1000;
const STORAGE_KEY = 'todos';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private _todos = signal<Todo[]>(INITIAL_TODOS);
  private _filter = signal<TodoFilter>('all');

  readonly todos = this._todos.asReadonly();
  readonly filter = this._filter.asReadonly();

  constructor() {
    const storedTodos = localStorage.getItem(STORAGE_KEY);


    if (storedTodos) {
      const parsedTodos = JSON.parse(storedTodos);
      const timeDiff = Date.now() - parsedTodos.lastUpdated;
      if (timeDiff < MAX_AGE) {
        this._todos.set(parsedTodos.todos);
      } else {
        // Remove expired data
        localStorage.removeItem(STORAGE_KEY);
        // Reset to initial todos
        this._todos.set(INITIAL_TODOS);
      }
    }

    effect(() => {
      const todos = this._todos();
      const lastUpdated = Date.now();
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ todos, lastUpdated }));
    });
  }

  readonly filteredTodos = computed(() => {
    const todos = this._todos();
    switch (this._filter()) {
      case 'active':
        return todos.filter((t) => !t.completed);
      case 'completed':
        return todos.filter((t) => t.completed);
      default:
        return todos;
    }
  });

  readonly stats = computed(() => {
    const todos = this._todos();
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const active = total - completed;
    const percentDone = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, active, percentDone };
  });

  readonly isEmpty = computed(() => this._todos().length === 0);

  addTodo(text: string, priority: Priority): void {
    this._todos.update((todos) => [
      ...todos,
      {
        id: crypto.randomUUID(),
        text,
        completed: false,
        createdAt: new Date(),
        priority,
      },
    ]);
  }

  toggleTodo(id: string): void {
    this._todos.update((todos) =>
      todos.map((t) =>
        t.id === id
          ? {
            ...t,
            completed: !t.completed,
            completedAt: !t.completed ? new Date() : undefined,
          }
          : t,
      ),
    );
  }

  deleteTodo(id: string): void {
    this._todos.update((todos) => todos.filter((t) => t.id !== id));
  }

  setFilter(filter: TodoFilter): void {
    this._filter.set(filter);
  }

  clearCompleted(): void {
    this._todos.update((todos) => todos.filter((t) => !t.completed));
  }

  clearAll(): void {
    this._todos.set([]);
  }

  reset(): void {
    this._todos.set(INITIAL_TODOS);
  }
}
