import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-background-overlay',
  standalone: true,
  templateUrl: './background-overlay.html',
  styleUrl: './background-overlay.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BackgroundOverlay {}
