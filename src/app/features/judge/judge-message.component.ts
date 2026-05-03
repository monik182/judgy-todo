import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { JudgeMessage } from '../../shared/models/todo.model';

@Component({
  selector: 'app-judge-message',
  imports: [],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
  template: `
    <div
      class="judge-bubble"
      [class.judge-bubble--user]="message().type === 'observation'"
      [class.judge-bubble--ai]="message().type !== 'observation'"
      @fadeIn
    >
      @if (message().type !== 'observation') {
        <div class="judge-bubble__avatar judge-bubble__avatar--ai">AIC</div>
      }
      <div class="judge-bubble__content">
        <p class="judge-bubble__text">{{ message().text }}</p>
      </div>
      @if (message().type === 'observation') {
        <div class="judge-bubble__avatar judge-bubble__avatar--user">MC</div>
      }
    </div>
  `,
  styles: `
    .judge-bubble {
      display: flex;
      gap: 10px;
      margin-bottom: 12px;
      align-items: flex-start;
    }
    .judge-bubble--ai {
      justify-content: flex-start;
      padding-right: 48px;
    }
    .judge-bubble--user {
      justify-content: flex-end;
      padding-left: 48px;
    }
    .judge-bubble__avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 700;
      flex-shrink: 0;
    }
    .judge-bubble__avatar--ai {
      background: #7B1FA2;
      color: white;
    }
    .judge-bubble__avatar--user {
      background: #FFC107;
      color: #333;
    }
    .judge-bubble__content {
      flex: 1;
      min-width: 0;
    }
    .judge-bubble--ai .judge-bubble__content {
      background: #f0e6f6;
      color: #333;
      border-radius: 4px 16px 16px 16px;
      padding: 12px 16px;
    }
    .judge-bubble--user .judge-bubble__content {
      background: #e0d0ee;
      color: #333;
      border-radius: 16px 4px 16px 16px;
      padding: 12px 16px;
    }
    .judge-bubble__text {
      margin: 0;
      line-height: 1.5;
      font-size: 14px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JudgeMessageComponent {
  message = input.required<JudgeMessage>();
}
