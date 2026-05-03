import { Component, ChangeDetectionStrategy, inject, viewChild, effect, ElementRef } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { JudgeService } from '../../core/services/judge.service';
import { JudgeMessageComponent } from './judge-message.component';
import { JudgeInputComponent } from './judge-input.component';

@Component({
  selector: 'app-judge-panel',
  imports: [JudgeMessageComponent, JudgeInputComponent, MatProgressBarModule],
  template: `
    <div class="judge-panel">
      <div class="judge-panel__header">
        <span class="judge-panel__breadcrumb">Judgy To Dos</span>
      </div>

      <div class="judge-panel__messages" #scrollContainer>
        @for (message of judgeService.messages(); track message.id) {
          <app-judge-message [message]="message" />
        }

        @if (judgeService.isThinking()) {
          <div class="judge-panel__thinking">
            <mat-progress-bar mode="indeterminate" />
            <span>The judge is thinking...</span>
          </div>
        }
      </div>

      <div class="judge-panel__input">
        <app-judge-input (questionAsked)="onAsk($event)" />
      </div>
    </div>
  `,
  styles: `
    .judge-panel {
      height: 100%;
      display: flex;
      flex-direction: column;
      background: white;
      border-radius: 20px;
      overflow: hidden;
    }
    .judge-panel__header {
      padding: 16px 20px;
      border-bottom: 1px solid #eee;
    }
    .judge-panel__breadcrumb {
      font-size: 14px;
      font-weight: 500;
      color: #666;
    }
    .judge-panel__messages {
      flex: 1;
      overflow-y: auto;
      scroll-behavior: smooth;
      padding: 16px 20px;
    }
    .judge-panel__thinking {
      padding: 12px;
      text-align: center;
      font-style: italic;
      opacity: 0.7;
    }
    .judge-panel__thinking span {
      display: block;
      margin-top: 8px;
      font-size: 13px;
    }
    .judge-panel__input {
      padding: 12px 20px;
      border-top: 1px solid #eee;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JudgePanelComponent {
  judgeService = inject(JudgeService);
  private scrollContainer = viewChild<ElementRef>('scrollContainer');

  constructor() {
    effect(() => {
      this.judgeService.messages();
      const container = this.scrollContainer();
      if (container) {
        setTimeout(() => {
          container.nativeElement.scrollTop = container.nativeElement.scrollHeight;
        });
      }
    });
  }

  onAsk(question: string): void {
    this.judgeService.askJudge(question);
  }
}
