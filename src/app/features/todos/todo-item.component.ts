import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-todo-item',
  template: `<p>todo-item works!</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoItemComponent {}
