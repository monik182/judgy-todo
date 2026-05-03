import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { TodoFilter } from '../../shared/models/todo.model';

@Component({
  selector: 'app-todo-filters',
  template: `
    <div class="todo-filters">
      @for (option of filterOptions; track option.value) {
        <button
          (click)="filterChanged.emit(option.value)"
          [class.active]="currentFilter() === option.value"
          class="todo-filters__btn"
        >
          {{ option.label }} ({{ option.value === 'all' ? total() : option.value === 'active' ? activeCount() : completedCount() }})
        </button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoFiltersComponent {
  currentFilter = input.required<TodoFilter>();
  total = input.required<number>();
  activeCount = input.required<number>();
  completedCount = input.required<number>();
  filterChanged = output<TodoFilter>();

  filterOptions: { value: TodoFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
  ];
}
