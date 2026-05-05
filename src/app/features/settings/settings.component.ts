import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SettingsService } from './settings.service';
import { SettingsFormComponent } from "./settings-form.component";

@Component({
  selector: 'app-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SettingsFormComponent],
  template: `
    <div class="settings-component">
      <h1>Settings</h1>
      <app-settings-form 
        [initialValues]="{
          name: this.settingsService.name(),
          judgePersonality: this.settingsService.judgePersonality(),
          theme: this.settingsService.theme()
        }" 
        (settingsOutput)="settingsService.updateSettings($event)" 
      />
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

}
