import { Component, ChangeDetectionStrategy, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-judge-input',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="judge-input">
      <mat-form-field appearance="outline" class="judge-input__field">
        <mat-label>Ask the judge...</mat-label>
        <input matInput formControlName="question" />
      </mat-form-field>
      <button mat-fab type="submit" [disabled]="form.invalid">
        <mat-icon>send</mat-icon>
      </button>
    </form>
  `,
  styles: `
    .judge-input {
      display: flex;
      gap: 8px;
      align-items: flex-start;
    }
    .judge-input__field {
      flex: 1;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JudgeInputComponent {
  private fb = inject(FormBuilder);
  questionAsked = output<string>();

  form = this.fb.nonNullable.group({
    question: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    this.questionAsked.emit(this.form.getRawValue().question);
    this.form.reset({ question: '' });
  }
}
