import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
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
        <div class="form-section">
          <label class="form-label" for="name-input">Name</label>
          <input id="name-input" type="text" [formField]="settingsForm.name" placeholder="Enter your name" />
          @if (settingsForm.name().invalid() && settingsForm.name().touched()) {
            <div class="form-error">
              @for (error of settingsForm.name().errors(); track error.kind) {
                <span>{{ error.message }}</span>
              }
            </div>
          }
        </div>

        <div class="form-section">
          <label class="form-label" for="judge-personality">Judge Personality</label>
          <p class="form-hint">Choose how the judge talks to you</p>
          <mat-radio-group id="judge-personality" aria-label="Judge Personality" [formField]="settingsForm.judgePersonality">
            <mat-radio-button value="sarcastic">Sarcastic</mat-radio-button>
            <mat-radio-button value="supportive">Supportive</mat-radio-button>
            <mat-radio-button value="savage">Savage</mat-radio-button>
          </mat-radio-group>
        </div>

        <div class="form-section">
          <label class="form-label" for="theme">Theme</label>
          <p class="form-hint">Pick a vibe for the app</p>
          <mat-radio-group id="theme" aria-label="Theme" [formField]="settingsForm.theme">
            <mat-radio-button value="light">Light</mat-radio-button>
            <mat-radio-button value="dark">Dark</mat-radio-button>
            <mat-radio-button value="purple">Purple</mat-radio-button>
          </mat-radio-group>
        </div>

        <div class="form-actions">
          <button matButton="text" [disabled]="settingsForm().invalid() || !hasChanges()" (click)="onDiscard()">Discard</button>
          <button matButton="filled" type="submit" [disabled]="settingsForm().invalid() || !hasChanges()">Save</button>
        </div>
      </form>
    </div>
  `,
  styles: `
    .settings-form {
      padding: 8px 4px;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 28px;
    }

    .form-section {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-label {
      font-size: 13px;
      font-weight: 600;
      color: #5a2d82;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .form-hint {
      font-size: 12px;
      color: #888;
      margin: 0 0 4px 0;
    }

    input {
      outline: none;
      width: 100%;
      font-size: 14px;
      font-family: inherit;
      border: 1.5px solid rgba(123, 31, 162, 0.2);
      border-radius: 12px;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.85);
      box-sizing: border-box;
      transition: border-color 0.2s, box-shadow 0.2s;

      &:focus {
        border-color: #7B1FA2;
        box-shadow: 0 0 0 3px rgba(123, 31, 162, 0.1);
      }

      &::placeholder {
        color: #bbb;
      }
    }

    mat-radio-group {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .form-error {
      color: #d32f2f;
      font-size: 12px;
      margin-top: 2px;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      padding-top: 8px;
      border-top: 1px solid rgba(123, 31, 162, 0.1);
    }
  `
})
export class SettingsFormComponent {

  settingsOutput = output<SettingsData>();
  initialValues = input<SettingsData>();
  settingsModel = signal<SettingsData>({ name: '', judgePersonality: 'sarcastic', theme: 'light' });
  hasChanges = computed(() => {
    const current = this.settingsModel();
    const initial = this.initialValues();
    if (!initial) return false;
    return current.name !== initial.name
      || current.judgePersonality !== initial.judgePersonality
      || current.theme !== initial.theme;
  });
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
