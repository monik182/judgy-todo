import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Todo } from '../../shared/models/todo.model';

@Component({
  selector: 'app-todo-item',
  imports: [MatIconModule, MatButtonModule],
  template: `
    <div class="todo-item" [class.todo-item--completed]="todo().completed" (click)="toggled.emit(todo().id)" (keydown.enter)="toggled.emit(todo().id)" tabindex="0">
      <span class="todo-item__text">{{ todo().text }}</span>
      <button
        class="todo-item__delete"
        (click)="$event.stopPropagation(); deleted.emit(todo().id)"
      >
        <mat-icon>close</mat-icon>
      </button>
      <button
        class="todo-item__check"
        [class.todo-item__check--done]="todo().completed"
        (click)="$event.stopPropagation(); toggled.emit(todo().id)"
      >
        @if (todo().completed) {
          <mat-icon>check</mat-icon>
        }
      </button>
    </div>
  `,
  styles: `
    .todo-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 12px;
      margin-bottom: 8px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .todo-item:hover {
      background: rgba(255, 255, 255, 0.85);
    }
    .todo-item--completed .todo-item__text {
      text-decoration: line-through;
      opacity: 0.5;
    }
    .todo-item__text {
      flex: 1;
      font-size: 14px;
      line-height: 1.4;
    }
    .todo-item__check {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid #7B1FA2;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      flex-shrink: 0;
      transition: all 0.2s;
      padding: 0;
    }
    .todo-item__check--done {
      background: #7B1FA2;
      border-color: #7B1FA2;
      color: white;
    }
    .todo-item__check mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
    .todo-item__delete {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: none;
      background: transparent;
      color: #999;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      opacity: 0;
      transition: opacity 0.2s, color 0.2s;
      flex-shrink: 0;
    }
    .todo-item:hover .todo-item__delete {
      opacity: 1;
    }
    .todo-item__delete:hover {
      color: #d32f2f;
    }
    .todo-item__delete mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoItemComponent {
  todo = input.required<Todo>();
  toggled = output<string>();
  deleted = output<string>();
}
