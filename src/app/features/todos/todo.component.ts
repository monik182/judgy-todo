import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TodoService } from './todo.service';
import { TodoInputComponent } from './todo-input.component';
import { TodoItemComponent } from './todo-item.component';
import { TodoFiltersComponent } from './todo-filters.component';
import { TodoStatsComponent } from './todo-stats.component';
import { Priority, TodoFilter } from '../../shared/models/todo.model';

@Component({
  selector: 'app-todo',
  imports: [
    TodoInputComponent, TodoItemComponent, TodoFiltersComponent, TodoStatsComponent,
    MatCardModule, MatDividerModule, MatButtonModule, MatIconModule,
  ],
  template: `
    <mat-card class="todo-panel">
      <mat-card-header>
        <mat-card-title>📝 TODO PANEL</mat-card-title>
      </mat-card-header>

      <mat-card-content>
        <app-todo-input (todoAdded)="onAdd($event)" />

        <mat-divider />

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

        <mat-divider />

        <app-todo-filters
          [currentFilter]="todoService.filter()"
          [total]="todoService.stats().total"
          [activeCount]="todoService.stats().active"
          [completedCount]="todoService.stats().completed"
          (filterChanged)="onFilterChange($event)"
        />

        <app-todo-stats [stats]="todoService.stats()" />
      </mat-card-content>

      @if (todoService.stats().completed > 0) {
        <mat-card-actions>
          <button mat-button color="warn" (click)="onClearCompleted()">
            <mat-icon>delete_sweep</mat-icon>
            Clear completed
          </button>
        </mat-card-actions>
      }
    </mat-card>
  `,
  styles: `
    .todo-panel {
      height: 100%;
    }
    .todo-panel__list {
      padding: 8px 0;
      min-height: 100px;
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

  onAdd(event: { text: string; priority: Priority }): void {
    this.todoService.addTodo(event.text, event.priority);
  }

  onToggle(id: string): void {
    this.todoService.toggleTodo(id);
  }

  onDelete(id: string): void {
    this.todoService.deleteTodo(id);
  }

  onFilterChange(filter: TodoFilter): void {
    this.todoService.setFilter(filter);
  }

  onClearCompleted(): void {
    this.todoService.clearCompleted();
  }
}
