import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SettingsService } from './settings.service';
import { SettingsFormComponent } from './settings-form.component';
import { MatTabsModule } from '@angular/material/tabs';
import { TodoService } from '../todos/todo.service';
import { MatButtonModule } from '@angular/material/button';
import { JudgeService } from '../../core/services/judge.service';
import { DangerZoneComponent } from './danger-zone.component';
import { SettingsData } from './settings.model';

@Component({
  selector: 'app-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SettingsFormComponent, MatTabsModule, MatButtonModule, DangerZoneComponent],
  template: `
    <div class="settings-component">
      <h1 class="settings-title">Settings</h1>
      <div class="settings-card">
        <mat-tab-group>
          <mat-tab label="User Settings">
            @defer (on viewport) {
              <app-settings-form
                [initialValues]="{
                  name: settingsService.name(),
                  judgePersonality: settingsService.judgePersonality(),
                  theme: settingsService.theme()
                }"
                (settingsOutput)="onSaveSettings($event)"
              />
            } @placeholder {
              <div class="settings-loading">Loading...</div>
            } @loading (minimum 200ms) {
              <div class="settings-loading">Loading...</div>
            }
          </mat-tab>
          <mat-tab label="Danger Zone">
            @defer (on viewport) {
              <app-danger-zone (clearAllOutput)="clearAll()" (resetAllOutput)="resetAll()" />
            } @placeholder {
              <div class="settings-loading">Loading...</div>
            } @loading (minimum 200ms) {
              <div class="settings-loading">Loading...</div>
            }
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
      overflow: hidden;
    }
    .settings-component {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }

    .settings-title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin: 0 0 16px 0;
    }

    .settings-card {
      background: linear-gradient(145deg, #e8d5f5, #d4b8e8);
      border-radius: 20px;
      padding: 24px;
      flex: 1;
      min-height: 0;
      overflow-y: auto;
    }

    .settings-loading {
      padding: 24px;
      text-align: center;
      color: #7B1FA2;
      font-size: 14px;
      opacity: 0.6;
    }

    ::ng-deep .settings-card .mat-mdc-tab-labels {
      gap: 4px;
    }

    ::ng-deep .settings-card .mdc-tab {
      border-radius: 12px;
    }

    ::ng-deep .settings-card .mat-mdc-tab:not(.mdc-tab--active) {
      opacity: 0.7;
    }
  `
})
export class SettingsComponent {
  settingsService = inject(SettingsService);
  todoService = inject(TodoService);
  judgeService = inject(JudgeService);
  private snackBar = inject(MatSnackBar);

  onSaveSettings(data: SettingsData) {
    this.settingsService.updateSettings(data);
    this.snackBar.open('Settings saved', 'OK', { duration: 3000 });
  }

  resetAll() {
    this.todoService.reset();
    this.snackBar.open('Todos reset', 'OK', { duration: 3000 });
  }

  clearAll() {
    this.todoService.clearAll();
    this.judgeService.reactToAction('ON_CLEAR_ALL_TASKS');
  }

}
