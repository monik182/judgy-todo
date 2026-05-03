import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-todo-input',
  template: `<p>todo-input works!</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoInputComponent {}
