import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SettingsService } from './settings.service';
import { SettingsFormComponent } from './settings-form.component';
import { MatTabsModule } from '@angular/material/tabs';
import { TodoService } from '../todos/todo.service';
import { MatButtonModule } from '@angular/material/button';
import { JudgeService } from '../../core/services/judge.service';
import { DangerZoneComponent } from './danger-zone.component';

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
                name: this.settingsService.name(),
                judgePersonality: this.settingsService.judgePersonality(),
                theme: this.settingsService.theme()
              }"
              (settingsOutput)="settingsService.updateSettings($event)"
            />
          } @placeholder {
            <div>Loading...</div>
          } @loading (minimum 200ms) {
            <div>Loading...</div>
          }
        </mat-tab>
        <mat-tab label="Danger Zone">
          @defer (on viewport) {
            <app-danger-zone (clearAllOutput)="clearAll()" (resetAllOutput)="todoService.reset()" />
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

  clearAll() {
    this.todoService.clearAll();
    this.judgeService.reactToAction('ON_CLEAR_ALL_TASKS');
  }

}
