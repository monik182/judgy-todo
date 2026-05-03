import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'todos', pathMatch: 'full' },
  {
    path: 'todos',
    loadComponent: () =>
      import('./features/todos/todo.component').then((m) => m.TodoComponent),
  },
];
