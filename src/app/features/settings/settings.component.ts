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
      <h1>Settings</h1>
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
            <div>Loading...</div>
          } @loading (minimum 200ms) {
            <div>Loading...</div>
          }
        </mat-tab>
        <mat-tab label="Danger Zone">
          @defer (on viewport) {
            <app-danger-zone (clearAllOutput)="clearAll()" (resetAllOutput)="resetAll()" />
          } @placeholder {
            <div>Loading...</div>
          } @loading (minimum 200ms) {
            <div>Loading...</div>
          }
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: `
    .settings-component {
      display: flex;
      flex-direction: column;
      gap: 16px;
      height: 100%;
    }

    app-settings-form {
      flex: 1;
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
