# 🔥 JudgyTodos — The Todo App That Roasts You

> *A normal todo app... except it has an AI copilot that judges every single thing you do.*

Add a task? It has opinions. Complete one after 3 days? It notices. Delete one you never started? Oh, it *definitely* notices.

This project is a hands-on exercise to practice **modern Angular (v19+)** by building something actually fun. You'll cover standalone components, signals, the new control flow, services, RxJS, reactive forms, and an AI copilot sidebar — all the patterns a Senior Frontend Engineer needs to know.

---

## 🧠 What You're Building

A two-panel layout:

```
┌─────────────────────────────────────────────────────┐
│  🔥 JudgyTodos                                      │
├──────────────────────────┬──────────────────────────┤
│                          │                          │
│   📝 TODO PANEL          │   🤖 JUDGE PANEL         │
│                          │                          │
│   [Add task input]       │   "Oh great, another     │
│   [ ] Buy groceries  🗑️ │    task you'll abandon    │
│   [✓] Fix bug #42    🗑️ │    by Wednesday."         │
│   [ ] Learn Angular  🗑️ │                          │
│   [ ] Call mom       🗑️ │   "You completed a task!  │
│                          │    I'm genuinely shocked."│
│   ── Filters ──          │                          │
│   [All] [Active] [Done]  │   "Deleting tasks now?   │
│                          │    That's one way to      │
│   Stats: 2/4 done (50%) │    achieve inbox zero."   │
│                          │                          │
├──────────────────────────┴──────────────────────────┤
│  💬 Ask the judge: [type here...]          [Send]   │
└─────────────────────────────────────────────────────┘
```

**Left panel:** A fully functional todo app with add, complete, delete, filter, and stats.
**Right panel:** An AI "judge" that reacts to your actions with sarcastic commentary AND answers questions.
**Bottom bar:** A chat input where you can ask the judge things like *"What should I do first?"* or *"Am I being productive?"*

---

## 🚀 Phase 0: Project Setup

Create a new Angular project from scratch:

```bash
ng new judgy-todos --standalone --style=scss --routing --ssr=false
cd judgy-todos
ng serve
```

Set up this folder structure:

```
src/app/
├── app.ts                        # Root layout component
├── app.config.ts                 # Functional bootstrapping
├── app.routes.ts                 # Routes (lazy-loaded)
│
├── core/                         # Singletons, app-wide concerns
│   └── services/
│       └── judge.service.ts      # The AI judge brain
│
├── features/
│   ├── todos/
│   │   ├── todo.component.ts     # Smart/container component
│   │   ├── todo-input.component.ts   # Dumb: the add-task form
│   │   ├── todo-item.component.ts    # Dumb: single todo row
│   │   ├── todo-filters.component.ts # Dumb: filter buttons
│   │   ├── todo-stats.component.ts   # Dumb: progress stats
│   │   └── todo.service.ts       # Todo state management
│   │
│   └── judge/
│       ├── judge-panel.component.ts  # Smart: judge sidebar
│       ├── judge-message.component.ts # Dumb: single roast bubble
│       └── judge-input.component.ts  # Dumb: chat input
│
└── shared/
    ├── pipes/
    │   └── time-ago.pipe.ts      # "2 hours ago" pipe
    └── models/
        └── todo.model.ts         # Interfaces
```

> **Why this structure?** In the interview, you should be able to explain: *"I organize by feature, separate smart and dumb components, and keep shared utilities in a common folder. This scales well and makes lazy loading straightforward."*

---

## 📋 Phase 1: The Data Model & Todo Service

### Step 1.1 — Define your models

**File: `shared/models/todo.model.ts`**

```typescript
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
  priority: 'low' | 'medium' | 'high';
}

export type TodoFilter = 'all' | 'active' | 'completed';

export interface JudgeMessage {
  id: string;
  text: string;
  type: 'roast' | 'praise' | 'observation' | 'response';
  timestamp: Date;
}
```

### Step 1.2 — Build the Todo Service with Signals

**File: `features/todos/todo.service.ts`**

This is the heart of your state management. Build it with these requirements:

**State (private writable signals):**
- `_todos` — `signal<Todo[]>` initialized with 2-3 sample todos
- `_filter` — `signal<TodoFilter>` defaulting to `'all'`

**Public API (readonly signals + computed):**
- `todos` — readonly version of `_todos`
- `filter` — readonly version of `_filter`
- `filteredTodos` — `computed()` that applies the current filter
- `stats` — `computed()` returning `{ total, completed, active, percentDone }`
- `isEmpty` — `computed()` → boolean

**Methods:**
- `addTodo(text: string, priority: Priority): void`
- `toggleTodo(id: string): void`
- `deleteTodo(id: string): void`
- `setFilter(filter: TodoFilter): void`
- `clearCompleted(): void`

**Concepts to practice:**
- `signal()`, `computed()`, `.asReadonly()`
- `signal.update()` with immutable array operations
- `Injectable({ providedIn: 'root' })` for tree-shakable singleton

> 🎯 **Interview point:** If asked *"Why signals instead of RxJS for this?"*, answer: *"Signals are ideal for synchronous state like a todo list — simpler API, no subscription management, automatic dependency tracking. I'd use RxJS if I needed async streams like API calls or WebSocket data."*

---

## 🧩 Phase 2: Todo Components (Dumb Components)

### Step 2.1 — TodoInputComponent

**Requirements:**
- Uses **Reactive Forms** (`FormBuilder`, `Validators`) — NOT template-driven
- Input field for text + select dropdown for priority
- Submit button disabled when form is invalid
- Emits the new todo data via `output()` signal
- Clears the form after submit

**Angular concepts to use:**
- `input()`, `output()` signal APIs
- `inject(FormBuilder)`
- `ReactiveFormsModule` in standalone imports
- `ChangeDetectionStrategy.OnPush`

### Step 2.2 — TodoItemComponent

**Requirements:**
- Displays: checkbox, text, priority badge, time-ago, delete button
- Checkbox toggles completion via `output()`
- Delete button emits via `output()`
- Completed todos show strikethrough style
- Priority has color-coded badges (🔴 high, 🟡 medium, 🟢 low)

**Angular concepts to use:**
- `input.required<Todo>()`
- `output<string>()` for toggle and delete events
- `@if` / `@switch` new control flow
- `[class.completed]` binding
- The `TimeAgoPipe` (shared)

### Step 2.3 — TodoFiltersComponent

**Requirements:**
- Three buttons: All, Active, Completed
- Highlights the active filter
- Emits selected filter via `output()`
- Shows count next to each label: "Active (3)"

**Angular concepts to use:**
- `input()` for current filter and counts
- `output<TodoFilter>()`
- `@for` to loop over filter options

### Step 2.4 — TodoStatsComponent

**Requirements:**
- Progress bar showing % complete
- Text: "3 of 7 tasks done (43%)"
- Color changes based on progress (red < 30%, yellow 30-70%, green > 70%)

**Angular concepts to use:**
- `input.required()` for stats object
- `computed()` for the color
- `[style.width.%]` binding for progress bar

---

## 🤖 Phase 3: The Judge (AI Copilot)

This is where it gets fun.

### Step 3.1 — JudgeService

**File: `core/services/judge.service.ts`**

The judge observes todo actions and generates sarcastic responses.

**State:**
- `_messages` — `signal<JudgeMessage[]>` with a welcome roast
- `_isThinking` — `signal<boolean>`

**Public API:**
- `messages` — readonly
- `isThinking` — readonly
- `reactToAction(action: string, context?: any): void` — generates a roast
- `askJudge(question: string): void` — user asks something, judge responds

**Implementation: The Roast Engine**

Build a method that picks contextual roasts. Some ideas:

```
ON_ADD_TASK:
- "Oh wonderful, another task you'll pretend doesn't exist by Thursday."
- "Adding '{task}'? Bold of you to assume you'll do it."
- "Your todo list is starting to look like a New Year's resolution graveyard."

ON_COMPLETE_TASK:
- "Wait... you actually DID something? Let me screenshot this."
- "'{task}' completed! The prophecy was wrong, you CAN finish things."
- "One down, {remaining} to go. At this rate, you'll be done by 2087."

ON_DELETE_TASK:
- "Deleting '{task}'? That's one way to handle accountability."
- "Ah, the classic 'it never existed' strategy. Respect."
- "Out of sight, out of mind. Very zen of you."

ON_CLEAR_COMPLETED:
- "Clearing the evidence of productivity? Suspicious."

ON_ASK (user question):
- Parse the question and give a sarcastic-but-helpful answer
- Use RxJS delay() to simulate "thinking"
```

**Advanced (optional): Real AI integration**

If you want to flex the AI nice-to-have from the job description, replace the hardcoded roasts with actual API calls:

```typescript
// Optional: Use a real LLM API
private generateRoast(action: string, context: string): Observable<string> {
  return this.http.post<{response: string}>('/api/judge', {
    prompt: `You are a sarcastic productivity coach. 
             The user just ${action}. Context: ${context}. 
             Respond in 1-2 sentences, be funny but not mean.`
  }).pipe(
    map(res => res.response),
    catchError(() => of(this.getRandomFallbackRoast(action)))
  );
}
```

**Concepts to practice:**
- `signal()` + `update()` for message history
- RxJS `delay()`, `switchMap()`, `of()` for simulating async
- `Observable` subscription with auto-cleanup
- `inject(HttpClient)` if doing real API calls

### Step 3.2 — JudgeMessageComponent (Dumb)

**Requirements:**
- Chat bubble with the judge's message
- Different styles per message type (roast = 🔥, praise = ⭐, observation = 👀, response = 💬)
- Fade-in animation on new messages
- Timestamp shown

**Angular concepts:**
- `input.required<JudgeMessage>()`
- `@switch` on message type
- CSS animations

### Step 3.3 — JudgePanelComponent (Smart)

**Requirements:**
- Scrollable area showing all judge messages
- Auto-scrolls to latest message
- Shows "thinking..." indicator when judge is generating
- Chat input at the bottom for asking questions

**Angular concepts:**
- `inject(JudgeService)`
- `effect()` for auto-scroll when messages change
- `viewChild()` for the scroll container
- `@for` with `track` for messages
- `@if` for thinking indicator

---

## 🔗 Phase 4: Wiring It Together

### Step 4.1 — TodoComponent (Smart/Container)

**File: `features/todos/todo.component.ts`**

This is the **smart component** that connects everything:

```
TodoComponent (smart)
├── TodoInputComponent (dumb) → emits new todos
├── @for loop
│   └── TodoItemComponent (dumb) → emits toggle/delete
├── TodoFiltersComponent (dumb) → emits filter changes
└── TodoStatsComponent (dumb) → displays computed stats
```

**Key responsibility:** When a todo action happens (add/complete/delete), it calls BOTH:
1. `todoService.addTodo(...)` — updates the todo state
2. `judgeService.reactToAction('added', { task: '...' })` — triggers a roast

### Step 4.2 — App Layout

**File: `app.ts`**

Build the two-panel layout:
- Left: `<app-todo />` 
- Right: `<app-judge-panel />`
- Bottom: chat input bar (part of judge panel or separate)

### Step 4.3 — Routes with Lazy Loading

**File: `app.routes.ts`**

Even though this is a single-page app, set up lazy loading to demonstrate the pattern:

```typescript
{
  path: '',
  loadComponent: () => import('./features/todos/todo.component')
    .then(m => m.TodoComponent)
}
```

---

## 🎨 Phase 5: Polish & Extras

### 5.1 — TimeAgoPipe (shared)

```typescript
// Transforms a Date into "2 minutes ago", "3 hours ago", "yesterday"
```

Practice: `Pipe` with `standalone: true`.

### 5.2 — Animations

Add entrance animations to:
- New todos sliding in
- Judge messages fading in
- Completed todos getting a brief celebration effect
- Delete with a slide-out

### 5.3 — Keyboard Shortcuts

- `Enter` to add todo
- `Ctrl+K` to focus the judge chat input

### 5.4 — Local persistence (bonus)

Save todos to `localStorage` using an `effect()`:

```typescript
// In todo.service.ts
constructor() {
  // Load from localStorage on init
  const saved = localStorage.getItem('todos');
  if (saved) this._todos.set(JSON.parse(saved));
  
  // Auto-save whenever todos change
  effect(() => {
    localStorage.setItem('todos', JSON.stringify(this._todos()));
  });
}
```

> 🎯 **Interview point:** *"effect() is perfect for side effects that should run whenever tracked signals change — like syncing to localStorage or analytics."*

### 5.5 — Dark mode toggle (bonus)

Use a signal + `[class.dark]` on the host element. Good for demonstrating signal-driven UI theming.

---

## ✅ Checklist: Angular Concepts Covered

When you finish, you should have practiced:

| Concept | Where |
|---|---|
| Standalone components | Every component |
| `signal()` | TodoService, JudgeService |
| `computed()` | filteredTodos, stats, progress color |
| `effect()` | Auto-scroll, localStorage sync |
| `input()` / `input.required()` | All dumb components |
| `output()` | TodoInput, TodoItem, Filters |
| `@if` / `@else` | Loading states, empty states |
| `@for` + `track` | Todo list, judge messages |
| `@switch` + `@case` | Priority badges, message types |
| `inject()` | All services, FormBuilder |
| `viewChild()` | Scroll containers, input focus |
| OnPush change detection | All components |
| Reactive Forms | TodoInput (FormBuilder + Validators) |
| RxJS (delay, switchMap, of) | JudgeService async responses |
| Lazy loading | app.routes.ts loadComponent |
| Smart/dumb pattern | Todo vs TodoItem, JudgePanel vs JudgeMessage |
| Standalone pipe | TimeAgoPipe |
| Feature-based structure | /features/todos, /features/judge |
| Service encapsulation | Private signals + public readonly |

---

## 🗣️ How to Talk About This in the Interview

> *"I built a todo app with a twist — it has an AI copilot sidebar that roasts you for your productivity habits. I used it to get hands-on with modern Angular patterns. The architecture follows the smart/dumb component split: a TodoService manages state with signals and computed values, while dumb components communicate through signal-based inputs and outputs. The judge uses RxJS for simulating async AI responses, with an effect() to auto-scroll the chat. Everything is standalone, OnPush, and lazy-loaded."*

If they ask about AI integration:

> *"The judge currently uses a local roast engine, but I designed the service so swapping in a real LLM API would be a one-line change in the service — the components don't care where the roasts come from. I'd use switchMap to cancel pending requests if the user acts faster than the AI responds."*

---

## 🏃 Suggested Build Order

**Hour 1:** Phase 0 + Phase 1 (setup + models + TodoService)
**Hour 2:** Phase 2 (all dumb todo components)
**Hour 3:** Phase 3.1 (JudgeService with roast engine)
**Hour 4:** Phase 3.2-3.3 (Judge components)
**Hour 5:** Phase 4 (wire everything, layout)
**Hour 6:** Phase 5 (polish, animations, extras)

Total: ~6 hours for a solid implementation, ~8 for a polished one.

---

*Now go build it. The judge is waiting.* 🔥