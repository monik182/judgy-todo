import { Component, ChangeDetectionStrategy, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Priority } from '../../shared/models/todo.model';

@Component({
  selector: 'app-todo-input',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="todo-input">
      <mat-form-field appearance="outline" class="todo-input__text">
        <mat-label>What needs doing?</mat-label>
        <input matInput formControlName="text" />
      </mat-form-field>

      <mat-form-field appearance="outline" class="todo-input__priority">
        <mat-label>Priority</mat-label>
        <mat-select formControlName="priority">
          <mat-option value="low">🟢 Low</mat-option>
          <mat-option value="medium">🟡 Medium</mat-option>
          <mat-option value="high">🔴 High</mat-option>
        </mat-select>
      </mat-form-field>

      <button mat-fab extended type="submit" [disabled]="form.invalid">
        <mat-icon>add</mat-icon>
        Add
      </button>
    </form>
  `,
  styles: `
    .todo-input {
      display: flex;
      gap: 8px;
      align-items: flex-start;
    }
    .todo-input__text {
      flex: 1;
    }
    .todo-input__priority {
      width: 140px;
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
    this.form.reset({ text: '', priority: 'medium' });
  }
}
