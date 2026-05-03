import { Component, ChangeDetectionStrategy, inject, viewChild, effect, ElementRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { JudgeService } from '../../core/services/judge.service';
import { JudgeMessageComponent } from './judge-message.component';
import { JudgeInputComponent } from './judge-input.component';

@Component({
  selector: 'app-judge-panel',
  imports: [JudgeMessageComponent, JudgeInputComponent, MatCardModule, MatProgressBarModule],
  template: `
    <mat-card class="judge-panel">
      <mat-card-header>
        <mat-card-title>🤖 JUDGE PANEL</mat-card-title>
      </mat-card-header>

      <mat-card-content>
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
      </mat-card-content>

      <mat-card-actions>
        <app-judge-input (questionAsked)="onAsk($event)" />
      </mat-card-actions>
    </mat-card>
  `,
  styles: `
    .judge-panel {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    mat-card-content {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .judge-panel__messages {
      flex: 1;
      overflow-y: auto;
      scroll-behavior: smooth;
      padding: 8px 0;
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
    mat-card-actions {
      padding: 8px 16px !important;
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
