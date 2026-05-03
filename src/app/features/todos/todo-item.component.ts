import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Todo } from '../../shared/models/todo.model';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-todo-item',
  imports: [TimeAgoPipe, MatCheckboxModule, MatChipsModule, MatIconModule, MatButtonModule],
  template: `
    <div class="todo-item" [class.completed]="todo().completed">
      <mat-checkbox
        [checked]="todo().completed"
        (change)="toggled.emit(todo().id)"
      />
      <span class="todo-item__text">{{ todo().text }}</span>
      <mat-chip-set>
        <mat-chip [highlighted]="true" class="badge--{{ todo().priority }}">
          @switch (todo().priority) {
            @case ('high') { 🔴 high }
            @case ('medium') { 🟡 medium }
            @case ('low') { 🟢 low }
          }
        </mat-chip>
      </mat-chip-set>
      <span class="todo-item__time">{{ todo().createdAt | timeAgo }}</span>
      <button mat-icon-button color="warn" (click)="deleted.emit(todo().id)">
        <mat-icon>delete</mat-icon>
      </button>
    </div>
  `,
  styles: `
    .todo-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
    }
    .todo-item.completed .todo-item__text {
      text-decoration: line-through;
      opacity: 0.5;
    }
    .todo-item__text {
      flex: 1;
    }
    .todo-item__time {
      font-size: 12px;
      opacity: 0.6;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoItemComponent {
  todo = input.required<Todo>();
  toggled = output<string>();
  deleted = output<string>();
}
