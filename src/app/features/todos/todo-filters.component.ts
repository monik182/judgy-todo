import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TodoFilter } from '../../shared/models/todo.model';

@Component({
  selector: 'app-todo-filters',
  imports: [MatButtonToggleModule],
  template: `
    <mat-button-toggle-group
      [value]="currentFilter()"
      (change)="filterChanged.emit($event.value)"
    >
      @for (option of filterOptions; track option.value) {
        <mat-button-toggle [value]="option.value">
          {{ option.label }} ({{ option.value === 'all' ? total() : option.value === 'active' ? activeCount() : completedCount() }})
        </mat-button-toggle>
      }
    </mat-button-toggle-group>
  `,
  styles: `
    mat-button-toggle-group {
      margin: 16px 0;
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

  filterOptions: { value: TodoFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
  ];
}
