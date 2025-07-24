import { Component, ChangeDetectionStrategy } from '@angular/core';
import { GameService } from '@core/services/game';

@Component({
  selector: 'app-left-sidebar',
  standalone: true,
  imports: [], // Add sub-components like Inventory, Research later
  templateUrl: './left-sidebar.html',
  styleUrl: './left-sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeftSidebar {
  constructor(public gameService: GameService) {}

  // Add collapse logic if needed
}
