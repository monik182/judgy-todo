import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { JudgeMessage } from '../../shared/models/todo.model';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-judge-message',
  imports: [TimeAgoPipe],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
  template: `
    <div class="judge-bubble" [class]="'judge-bubble--' + message().type" @fadeIn>
      <span class="judge-bubble__icon">
        @switch (message().type) {
          @case ('roast') { 🔥 }
          @case ('praise') { ⭐ }
          @case ('observation') { 👀 }
          @case ('response') { 💬 }
        }
      </span>
      <div class="judge-bubble__content">
        <p class="judge-bubble__text">{{ message().text }}</p>
        <span class="judge-bubble__time">{{ message().timestamp | timeAgo }}</span>
      </div>
    </div>
  `,
  styles: `
    .judge-bubble {
      display: flex;
      gap: 8px;
      padding: 12px;
      border-radius: 12px;
      margin-bottom: 8px;
    }
    .judge-bubble--roast {
      background-color: var(--mat-sys-error-container);
      color: var(--mat-sys-on-error-container);
    }
    .judge-bubble--praise {
      background-color: var(--mat-sys-primary-container);
      color: var(--mat-sys-on-primary-container);
    }
    .judge-bubble--observation {
      background-color: var(--mat-sys-surface-container-high);
      color: var(--mat-sys-on-surface);
    }
    .judge-bubble--response {
      background-color: var(--mat-sys-tertiary-container);
      color: var(--mat-sys-on-tertiary-container);
    }
    .judge-bubble__icon {
      font-size: 20px;
      flex-shrink: 0;
    }
    .judge-bubble__content {
      flex: 1;
      min-width: 0;
    }
    .judge-bubble__text {
      margin: 0;
      line-height: 1.4;
    }
    .judge-bubble__time {
      font-size: 11px;
      opacity: 0.6;
      margin-top: 4px;
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JudgeMessageComponent {
  message = input.required<JudgeMessage>();
}
