import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { Todo } from '../../shared/models/todo.model';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-todo-item',
  imports: [TimeAgoPipe],
  template: `
    <div class="todo-item" [class.completed]="todo().completed">
      <input
        type="checkbox"
        [checked]="todo().completed"
        (change)="toggled.emit(todo().id)"
        class="todo-item__checkbox"
      />
      <span class="todo-item__text">{{ todo().text }}</span>
      <span class="todo-item__badge" [class]="'badge--' + todo().priority">
        @switch (todo().priority) {
          @case ('high') { 🔴 high }
          @case ('medium') { 🟡 medium }
          @case ('low') { 🟢 low }
        }
      </span>
      <span class="todo-item__time">{{ todo().createdAt | timeAgo }}</span>
      <button (click)="deleted.emit(todo().id)" class="todo-item__delete">✕</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoItemComponent {
  todo = input.required<Todo>();
  toggled = output<string>();
  deleted = output<string>();
}
