import { Component, ChangeDetectionStrategy, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Priority } from '../../shared/models/todo.model';

@Component({
  selector: 'app-todo-input',
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="todo-input">
      <input
        formControlName="text"
        placeholder="What needs doing?"
        class="todo-input__text"
      />
      <select formControlName="priority" class="todo-input__priority">
        <option value="low">🟢 Low</option>
        <option value="medium">🟡 Medium</option>
        <option value="high">🔴 High</option>
      </select>
      <button type="submit" [disabled]="form.invalid" class="todo-input__submit">
        Add
      </button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoInputComponent {
  private fb = inject(FormBuilder);

  todoAdded = output<{ text: string; priority: Priority }>();

  form = this.fb.nonNullable.group({
    text: ['', Validators.required],
    priority: ['medium' as Priority],
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    const { text, priority } = this.form.getRawValue();
    this.todoAdded.emit({ text, priority });
    this.form.reset({ text: '', priority: 'medium' });
  }
}
