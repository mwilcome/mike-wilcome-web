import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-bottom-bar',
  standalone: true,
  templateUrl: './bottom-bar.html',
  styleUrl: './bottom-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BottomBar {
  // Add share logic later
}
