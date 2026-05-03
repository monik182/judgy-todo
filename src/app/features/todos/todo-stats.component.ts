import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-todo-stats',
  imports: [MatProgressBarModule],
  template: `
    <div class="todo-stats">
      <mat-progress-bar
        mode="determinate"
        [value]="stats().percentDone"
        [class]="'bar--' + color()"
      />
      <p class="todo-stats__text">
        {{ stats().completed }} of {{ stats().total }} tasks done ({{ stats().percentDone }}%)
      </p>
    </div>
  `,
  styles: `
    .todo-stats {
      margin: 16px 0;
    }
    .todo-stats__text {
      font-size: 13px;
      opacity: 0.7;
      margin-top: 8px;
    }
    .bar--red {
      --mdc-linear-progress-active-indicator-color: #ef5350;
    }
    .bar--yellow {
      --mdc-linear-progress-active-indicator-color: #ffc107;
    }
    .bar--green {
      --mdc-linear-progress-active-indicator-color: #66bb6a;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoStatsComponent {
  stats = input.required<{ total: number; completed: number; active: number; percentDone: number }>();

  color = computed(() => {
    const pct = this.stats().percentDone;
    if (pct < 30) return 'red';
    if (pct <= 70) return 'yellow';
    return 'green';
  });
}
