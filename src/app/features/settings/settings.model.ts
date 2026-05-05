export type JudgePersonality = 'savage' | 'sarcastic' | 'supportive';

export type Theme = 'dark' | 'light' | 'purple';

export interface SettingsData {
  name: string,
  judgePersonality: JudgePersonality,
  theme: Theme,
}
