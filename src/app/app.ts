import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { JudgePanelComponent } from './features/judge/judge-panel.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, JudgePanelComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
