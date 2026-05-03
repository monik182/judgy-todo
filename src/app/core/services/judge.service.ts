import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription, catchError, from, map, of, switchMap, timeout } from 'rxjs';
import { JudgeMessage } from '../../shared/models/todo.model';
import { TodoService } from '../../features/todos/todo.service';
import { TurnstileService } from './turnstile.service';

const MESSAGE_TYPES: Record<string, JudgeMessage['type']> = {
  ON_ADD_TASK: 'roast',
  ON_COMPLETE_TASK: 'praise',
  ON_DELETE_TASK: 'roast',
  ON_CLEAR_COMPLETED: 'roast',
  ON_ASK: 'response',
};

const ROASTS: Record<string, string[]> = {
  ON_ADD_TASK: [
    "Oh wonderful, another task you'll pretend doesn't exist by Thursday.",
    "Adding '{task}'? Bold of you to assume you'll do it.",
    "Your todo list is starting to look like a New Year's resolution graveyard.",
    "'{task}'... sure, let's all pretend this is happening.",
  ],
  ON_COMPLETE_TASK: [
    "Wait... you actually DID something? Let me screenshot this.",
    "'{task}' completed! The prophecy was wrong, you CAN finish things.",
    "One down, {remaining} to go. At this rate, you'll be done by 2087.",
    "Alert the media — a task was actually completed today.",
  ],
  ON_DELETE_TASK: [
    "Deleting '{task}'? That's one way to handle accountability.",
    "Ah, the classic 'it never existed' strategy. Respect.",
    "Out of sight, out of mind. Very zen of you.",
    "'{task}' has been eliminated. No witnesses.",
  ],
  ON_CLEAR_COMPLETED: [
    "Clearing the evidence of productivity? Suspicious.",
    "Destroying the receipts, I see. Very corporate of you.",
    "All that hard work, swept under the rug. Classic.",
  ],
  ON_ASK: [
    "You're asking ME for advice? That's... actually smart for once.",
    "Oh, you want MY opinion? How delightfully desperate.",
    "Let me consult my crystal ball... it says 'try harder'.",
    "Interesting question. My answer: have you tried not procrastinating?",
  ],
};

@Injectable({ providedIn: 'root' })
export class JudgeService {
  private http = inject(HttpClient);
  private todoService = inject(TodoService);
  private turnstile = inject(TurnstileService);

  private readonly apiUrl = 'https://judgy-todo-api.monik182.workers.dev/api/judge';

  private _messages = signal<JudgeMessage[]>([
    {
      id: crypto.randomUUID(),
      text: "Oh look, another productivity app. This will definitely be the one that changes your life. 🙄",
      type: 'roast',
      timestamp: new Date(),
    },
  ]);
  private _isThinking = signal(false);
  private _pendingSub: Subscription | null = null;

  readonly messages = this._messages.asReadonly();
  readonly isThinking = this._isThinking.asReadonly();

  reactToAction(action: string, context?: Record<string, string>): void {
    this._cancelPending();
    this._isThinking.set(true);

    this._pendingSub = this._callJudgeApi(action, undefined, context).subscribe((text) => {
      this._pushMessage(text, MESSAGE_TYPES[action] ?? 'roast');
      this._isThinking.set(false);
    });
  }

  askJudge(question: string): void {
    this._cancelPending();
    this._pushMessage(question, 'observation');
    this._isThinking.set(true);

    this._pendingSub = this._callJudgeApi('ON_ASK', question).subscribe((text) => {
      this._pushMessage(text, 'response');
      this._isThinking.set(false);
    });
  }

  private _callJudgeApi(
    action: string,
    question?: string,
    context?: Record<string, string>,
  ): Observable<string> {
    const todos = this.todoService.todos().map((t) => ({
      text: t.text,
      completed: t.completed,
    }));

    return from(this.turnstile.getToken().catch(() => null)).pipe(
      switchMap((turnstileToken) =>
        this.http.post<{ response: string }>(this.apiUrl, {
          action,
          question,
          context,
          todos,
          ...(turnstileToken && { turnstileToken }),
        }),
      ),
      timeout(8000),
      map((res) => res.response),
      catchError(() => {
        const template = this._pickRoast(action);
        const text = context ? this._interpolate(template, context) : template;
        return of(text);
      }),
    );
  }

  private _pushMessage(text: string, type: JudgeMessage['type']): void {
    this._messages.update((msgs) => [
      ...msgs,
      { id: crypto.randomUUID(), text, type, timestamp: new Date() },
    ]);
  }

  private _pickRoast(action: string): string {
    const pool = ROASTS[action] ?? ROASTS['ON_ASK'];
    return pool[Math.floor(Math.random() * pool.length)];
  }

  private _interpolate(template: string, context: Record<string, string>): string {
    return template.replace(/\{(\w+)\}/g, (_, key) => context[key] ?? key);
  }

  private _cancelPending(): void {
    this._pendingSub?.unsubscribe();
    this._pendingSub = null;
  }
}
