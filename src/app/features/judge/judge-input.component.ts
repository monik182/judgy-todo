import { Component, ChangeDetectionStrategy, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-judge-input',
  imports: [ReactiveFormsModule, MatIconModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="judge-input">
      <div class="judge-input__field">
        <input
          formControlName="question"
          placeholder="Write a message..."
          class="judge-input__native"
        />
      </div>
      <button type="submit" [disabled]="form.invalid" class="judge-input__send">
        <mat-icon>send</mat-icon>
      </button>
      <button type="button" class="judge-input__add">
        <mat-icon>add</mat-icon>
      </button>
    </form>
  `,
  styles: `
    .judge-input {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .judge-input__field {
      flex: 1;
      border: 1.5px solid #ccc;
      border-radius: 24px;
      padding: 10px 16px;
      background: white;
    }
    .judge-input__native {
      border: none;
      outline: none;
      width: 100%;
      font-size: 14px;
      font-family: inherit;
      background: transparent;
    }
    .judge-input__native::placeholder {
      color: #aaa;
    }
    .judge-input__send {
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
    .judge-input__send:disabled {
      opacity: 0.4;
      cursor: default;
    }
    .judge-input__send mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
    .judge-input__add {
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
    }
    .judge-input__add mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
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
