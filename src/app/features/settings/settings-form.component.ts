import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { form, required, FormField, FormRoot } from '@angular/forms/signals';
import { SettingsData } from './settings.model';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-settings-form',
  imports: [FormField, FormRoot, MatButtonModule, MatRadioModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="settings-form">
      <form [formRoot]="settingsForm">
        <div class="form-field">
          <label>
            <span>Name</span>
            <input type="text" [formField]="settingsForm.name" />
          </label>
        </div>

        <div class="form-field">
          <label>
            <span>Judge Personality</span>
            <mat-radio-group aria-label="Judge Personality" [formField]="settingsForm.judgePersonality">
              <mat-radio-button value="sarcastic">Sarcastic</mat-radio-button>
              <mat-radio-button value="supportive">Supportive</mat-radio-button>
              <mat-radio-button value="savage">Savage</mat-radio-button>
            </mat-radio-group>
          </label>
        </div>

        <div class="form-field">
          <label>
            <span>Theme</span>
            <mat-radio-group aria-label="Theme" [formField]="settingsForm.theme">
              <mat-radio-button value="light">Light</mat-radio-button>
              <mat-radio-button value="dark">Dark</mat-radio-button>
              <mat-radio-button value="purple">Purple</mat-radio-button>
            </mat-radio-group>
          </label>
        </div>

        <div class="form-actions">
          <button matButton="filled" type="submit" [disabled]="settingsForm().invalid() || !settingsForm().touched()">Save</button>
          <button matButton="text" [disabled]="settingsForm().invalid() || !settingsForm().touched()" (click)="onDiscard()">Discard</button>
        </div>
      </form>
      @if (settingsForm.name().invalid() && settingsForm.name().touched()) {
      <div class="error">
        @for (error of settingsForm.name().errors(); track error.kind) {
          <span>{{ error.message }}</span>
        }
      </div>
    }
    </div>
  `,
  styles: `

  .settings-form {
    padding: 20px;
  }
    .error {
      color: red;
      font-size: 12px;
      margin-top: 4px;
      text-align: left;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    input {
      outline: none;
      width: 100%;
      font-size: 14px;
      font-family: inherit;
      background: transparent;
      flex: 1;
      border: 1.5px solid #ccc;
      border-radius: 24px;
      padding: 10px 16px;
      background: white;
    }

    form {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 20px;
      height: 100%;
    }

    .form-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }
  `
})
export class SettingsFormComponent {

  settingsOutput = output<SettingsData>();
  initialValues = input<SettingsData>();
  settingsModel = signal<SettingsData>({ name: '', judgePersonality: 'sarcastic', theme: 'light' });
  settingsForm = form(this.settingsModel, (fieldPath) => {
    required(fieldPath.name, { message: 'Name is required' });
    required(fieldPath.judgePersonality, { message: 'Judge personality is required' });
    required(fieldPath.theme, { message: 'Theme is required' });
  }, {
    submission: {
      action: async (field) => {
        this.settingsOutput.emit(field().value());
      }
    }
  });

  constructor() {
    effect(() => {
      this.settingsModel.set({
        name: this.initialValues()?.name || '',
        judgePersonality: this.initialValues()?.judgePersonality || 'sarcastic',
        theme: this.initialValues()?.theme || 'light'
      });
    })
  }

  onDiscard() {
    this.settingsForm().reset();
    this.settingsModel.set({
      name: this.initialValues()?.name || '',
      judgePersonality: this.initialValues()?.judgePersonality || 'sarcastic',
      theme: this.initialValues()?.theme || 'light'
    });
  }

}
