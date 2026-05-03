import { TestBed } from '@angular/core/testing';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initial state', () => {
    it('should start with sample todos', () => {
      expect(service.todos().length).toBe(3);
    });

    it('should default filter to all', () => {
      expect(service.filter()).toBe('all');
    });

    it('should not be empty', () => {
      expect(service.isEmpty()).toBe(false);
    });
  });

  describe('addTodo', () => {
    it('should add a new todo', () => {
      const initialCount = service.todos().length;
      service.addTodo('New task', 'high');
      expect(service.todos().length).toBe(initialCount + 1);
    });

    it('should set correct properties on the new todo', () => {
      service.addTodo('Test task', 'medium');
      const added = service.todos().at(-1)!;
      expect(added.text).toBe('Test task');
      expect(added.priority).toBe('medium');
      expect(added.completed).toBe(false);
      expect(added.createdAt).toBeInstanceOf(Date);
      expect(added.completedAt).toBeUndefined();
    });
  });

  describe('toggleTodo', () => {
    it('should toggle a todo to completed', () => {
      const todo = service.todos().find((t) => !t.completed)!;
      service.toggleTodo(todo.id);
      const toggled = service.todos().find((t) => t.id === todo.id)!;
      expect(toggled.completed).toBe(true);
      expect(toggled.completedAt).toBeInstanceOf(Date);
    });

    it('should toggle a completed todo back to active', () => {
      const todo = service.todos().find((t) => t.completed)!;
      service.toggleTodo(todo.id);
      const toggled = service.todos().find((t) => t.id === todo.id)!;
      expect(toggled.completed).toBe(false);
      expect(toggled.completedAt).toBeUndefined();
    });
  });

  describe('deleteTodo', () => {
    it('should remove the todo', () => {
      const todo = service.todos()[0];
      const initialCount = service.todos().length;
      service.deleteTodo(todo.id);
      expect(service.todos().length).toBe(initialCount - 1);
      expect(service.todos().find((t) => t.id === todo.id)).toBeUndefined();
    });
  });

  describe('setFilter', () => {
    it('should update the filter', () => {
      service.setFilter('active');
      expect(service.filter()).toBe('active');
      service.setFilter('completed');
      expect(service.filter()).toBe('completed');
    });
  });

  describe('filteredTodos', () => {
    it('should return all todos when filter is all', () => {
      service.setFilter('all');
      expect(service.filteredTodos().length).toBe(service.todos().length);
    });

    it('should return only active todos when filter is active', () => {
      service.setFilter('active');
      expect(service.filteredTodos().every((t) => !t.completed)).toBe(true);
    });

    it('should return only completed todos when filter is completed', () => {
      service.setFilter('completed');
      expect(service.filteredTodos().every((t) => t.completed)).toBe(true);
    });
  });

  describe('stats', () => {
    it('should compute correct stats', () => {
      const stats = service.stats();
      expect(stats.total).toBe(3);
      expect(stats.completed).toBe(1);
      expect(stats.active).toBe(2);
      expect(stats.percentDone).toBe(33);
    });

    it('should update after adding a todo', () => {
      service.addTodo('Another one', 'low');
      const stats = service.stats();
      expect(stats.total).toBe(4);
      expect(stats.active).toBe(3);
      expect(stats.percentDone).toBe(25);
    });
  });

  describe('clearCompleted', () => {
    it('should remove all completed todos', () => {
      service.clearCompleted();
      expect(service.todos().every((t) => !t.completed)).toBe(true);
      expect(service.todos().length).toBe(2);
    });
  });

  describe('isEmpty', () => {
    it('should return true when all todos are deleted', () => {
      const ids = service.todos().map((t) => t.id);
      ids.forEach((id) => service.deleteTodo(id));
      expect(service.isEmpty()).toBe(true);
    });
  });
});
