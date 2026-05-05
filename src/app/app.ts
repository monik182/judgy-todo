import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { JudgePanelComponent } from './features/judge/judge-panel.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, JudgePanelComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
