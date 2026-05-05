import { Injectable, signal, effect } from '@angular/core';
import { JudgePersonality, SettingsData, Theme } from './settings.model';

const SETTINGS_KEY = 'settings';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private _name = signal<string>("User")
  private _judgePersonality = signal<JudgePersonality>("sarcastic")
  private _theme = signal<Theme>("light")

  readonly name = this._name.asReadonly();
  readonly judgePersonality = this._judgePersonality.asReadonly();
  readonly theme = this._theme.asReadonly();

  constructor() {
    const savedSettings = localStorage.getItem(SETTINGS_KEY);

    if (savedSettings) {
      const parsedData: SettingsData = JSON.parse(savedSettings)
      this._name.set(parsedData.name || "User");
      this._judgePersonality.set(parsedData.judgePersonality || "sarcastic");
      this._theme.set(parsedData.theme || "light");
    }

    effect(() => {
      const settings = {
        name: this._name(),
        judgePersonality: this._judgePersonality(),
        theme: this._theme(),
      };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    });
  }

  updateSettings(data: SettingsData) {
    this._name.set(data.name);
    this._judgePersonality.set(data.judgePersonality);
    this._theme.set(data.theme);
  }

}
