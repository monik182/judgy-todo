import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

@Component({
  selector: 'app-todo-stats',
  template: `
    <div class="todo-stats">
      <div class="todo-stats__bar">
        <div
          class="todo-stats__fill"
          [style.width.%]="stats().percentDone"
          [class]="'fill--' + color()"
        ></div>
      </div>
      <p class="todo-stats__text">
        {{ stats().completed }} of {{ stats().total }} tasks done ({{ stats().percentDone }}%)
      </p>
    </div>
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
