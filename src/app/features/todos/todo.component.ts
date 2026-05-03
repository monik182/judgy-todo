import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-todo',
  template: `<p>todo works!</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoComponent {}
