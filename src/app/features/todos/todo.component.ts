import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { TodoService } from './todo.service';
import { JudgeService } from '../../core/services/judge.service';
import { TodoInputComponent } from './todo-input.component';
import { TodoItemComponent } from './todo-item.component';
import { TodoFiltersComponent } from './todo-filters.component';
import { TodoStatsComponent } from './todo-stats.component';
import { Priority, TodoFilter } from '../../shared/models/todo.model';

@Component({
  selector: 'app-todo',
  imports: [
    TodoInputComponent, TodoItemComponent, TodoFiltersComponent, TodoStatsComponent,
  ],
  template: `
    <div class="todo-panel">
      <app-todo-stats [stats]="todoService.stats()" />

      <div class="todo-panel__card">
        <h2 class="todo-panel__title">Your Tasks</h2>

        <div class="todo-panel__list">
          @for (todo of todoService.filteredTodos(); track todo.id) {
            <app-todo-item
              [todo]="todo"
              (toggled)="onToggle($event)"
              (deleted)="onDelete($event)"
            />
          } @empty {
            <p class="todo-panel__empty">No tasks here. The judge is watching...</p>
          }
        </div>

        <app-todo-filters
          [currentFilter]="todoService.filter()"
          [total]="todoService.stats().total"
          [activeCount]="todoService.stats().active"
          [completedCount]="todoService.stats().completed"
          (filterChanged)="onFilterChange($event)"
          (clearCompleted)="onClearCompleted()"
        />
      </div>

      <app-todo-input (todoAdded)="onAdd($event)" />
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
      overflow: hidden;
    }
    .todo-panel {
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .todo-panel__card {
      background: linear-gradient(145deg, #e8d5f5, #d4b8e8);
      border-radius: 20px;
      padding: 20px;
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
    }
    .todo-panel__title {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 16px 0;
      color: #333;
    }
    .todo-panel__list {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
    }
    .todo-panel__empty {
      text-align: center;
      opacity: 0.5;
      font-style: italic;
      padding: 24px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoComponent {
  todoService = inject(TodoService);
  private judgeService = inject(JudgeService);

  onAdd(event: { text: string; priority: Priority }): void {
    this.todoService.addTodo(event.text, event.priority);
    this.judgeService.reactToAction('ON_ADD_TASK', { task: event.text });
  }

  onToggle(id: string): void {
    this.todoService.toggleTodo(id);
    const todo = this.todoService.todos().find((t) => t.id === id);
    if (todo?.completed) {
      this.judgeService.reactToAction('ON_COMPLETE_TASK', {
        task: todo.text,
        remaining: String(this.todoService.stats().active),
      });
    }
  }

  onDelete(id: string): void {
    const todo = this.todoService.todos().find((t) => t.id === id);
    this.todoService.deleteTodo(id);
    this.judgeService.reactToAction('ON_DELETE_TASK', { task: todo?.text ?? 'something' });
  }

  onFilterChange(filter: TodoFilter): void {
    this.todoService.setFilter(filter);
  }

  onClearCompleted(): void {
    this.todoService.clearCompleted();
    this.judgeService.reactToAction('ON_CLEAR_COMPLETED');
  }
}
