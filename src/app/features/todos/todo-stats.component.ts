import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-todo-stats',
  imports: [MatProgressBarModule],
  template: `
    <div class="todo-stats">
      <p class="todo-stats__label">This week status</p>
      <div class="todo-stats__bar-row">
        <mat-progress-bar mode="determinate" [value]="stats().percentDone" />
        <span class="todo-stats__pct">{{ stats().percentDone }}%</span>
      </div>
    </div>
  `,
  styles: `
    .todo-stats {
      margin-bottom: 16px;
    }
    .todo-stats__label {
      font-size: 14px;
      font-weight: 500;
      color: #7B1FA2;
      margin: 0 0 8px 0;
    }
    .todo-stats__bar-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    mat-progress-bar {
      flex: 1;
      --mdc-linear-progress-active-indicator-color: #FFC107;
      --mdc-linear-progress-track-color: #e8e0f0;
      border-radius: 8px;
    }
    .todo-stats__pct {
      font-size: 13px;
      font-weight: 600;
      color: #555;
      min-width: 36px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoStatsComponent {
  stats = input.required<{ total: number; completed: number; active: number; percentDone: number }>();
}
