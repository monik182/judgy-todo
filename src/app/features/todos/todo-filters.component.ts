import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TodoFilter } from '../../shared/models/todo.model';

@Component({
  selector: 'app-todo-filters',
  imports: [MatButtonModule],
  template: `
    <div class="todo-filters">
      @if (currentFilter() === 'active' || currentFilter() === 'all') {
        <button class="todo-filters__btn" (click)="filterChanged.emit('completed')">
          Show completed to-dos
        </button>
      }
      @if (currentFilter() === 'completed') {
        <button class="todo-filters__btn" (click)="filterChanged.emit('active')">
          Show active to-dos
        </button>
      }
    </div>
  `,
  styles: `
    .todo-filters {
      display: flex;
      justify-content: flex-end;
      padding: 8px 0;
    }
    .todo-filters__btn {
      background: linear-gradient(135deg, #9C27B0, #7B1FA2);
      color: white;
      border: none;
      border-radius: 20px;
      padding: 8px 20px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    .todo-filters__btn:hover {
      opacity: 0.9;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoFiltersComponent {
  currentFilter = input.required<TodoFilter>();
  total = input.required<number>();
  activeCount = input.required<number>();
  completedCount = input.required<number>();
  filterChanged = output<TodoFilter>();
}
