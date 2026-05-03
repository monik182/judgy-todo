import { Component, ChangeDetectionStrategy, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Priority } from '../../shared/models/todo.model';

@Component({
  selector: 'app-todo-input',
  imports: [ReactiveFormsModule, MatIconModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="todo-input">
      <div class="todo-input__field">
        <input
          formControlName="text"
          placeholder="What needs doing?"
          class="todo-input__native"
        />
      </div>
      <button type="submit" [disabled]="form.invalid" class="todo-input__send">
        <mat-icon>add</mat-icon>
      </button>
    </form>
  `,
  styles: `
    .todo-input {
      display: flex;
      gap: 8px;
      align-items: center;
      padding: 8px 0;
    }
    .todo-input__field {
      flex: 1;
      border: 1.5px solid #ccc;
      border-radius: 24px;
      padding: 10px 16px;
      background: white;
    }
    .todo-input__native {
      border: none;
      outline: none;
      width: 100%;
      font-size: 14px;
      font-family: inherit;
      background: transparent;
    }
    .todo-input__native::placeholder {
      color: #aaa;
    }
    .todo-input__send {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: none;
      background: #7B1FA2;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: opacity 0.2s;
    }
    .todo-input__send:disabled {
      opacity: 0.4;
      cursor: default;
    }
    .todo-input__send mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
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
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }
}
