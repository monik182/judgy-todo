import { Component, ChangeDetectionStrategy, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Priority } from '../../shared/models/todo.model';
import { form, required, FormField, submit } from '@angular/forms/signals';

@Component({
  selector: 'app-todo-input',
  imports: [MatIconModule, FormField],
  template: `
    <form (submit)="onSubmit($event)" class="todo-input">
      <div class="todo-input__field">
        <input
          formControlName="text"
          placeholder="What needs doing?"
          class="todo-input__native"
          [formField]="todoForm.text"
        />
      </div>
      <button type="submit" [disabled]="todoForm().invalid()" class="todo-input__send">
        <mat-icon>add</mat-icon>
      </button>
    </form>
    @if (todoForm.text().invalid() && todoForm.text().touched()) {
      <div class="error">
        @for (error of todoForm.text().errors(); track error.kind) {
          <span>{{ error.message }}</span>
        }
      </div>
    }

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
    .error {
      color: red;
      font-size: 12px;
      margin-top: 4px;
      text-align: center;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoInputComponent {
  todoModel = signal<{ text: string; priority: Priority | null }>({ text: '', priority: 'medium' });
  todoForm = form(this.todoModel, (fieldPath) => {
    required(fieldPath.text, { message: 'Text is required' });
  })

  todoAdded = output<{ text: string; priority: Priority }>();

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.todoForm().invalid()) return;
    submit(this.todoForm, async () => {
      const data = this.todoModel()
      const { text, priority } = data;
      this.todoAdded.emit({ text, priority: priority! });
      this.todoModel.set({ text: '', priority: 'medium' });
      this.todoForm().reset();
    });
  }
}
