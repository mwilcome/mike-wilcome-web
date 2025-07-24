import { Component, ChangeDetectionStrategy } from '@angular/core';
import { GameService } from '@core/services/game';
import { Upgrades } from './upgrades/upgrades'; // Import existing
import { Stats } from './stats/stats'; // Import existing

@Component({
  selector: 'app-right-sidebar',
  standalone: true,
  imports: [Upgrades, Stats],
  templateUrl: './right-sidebar.html',
  styleUrl: './right-sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RightSidebar {
  constructor(public gameService: GameService) {}

  prestigeConfirm() {
    if (confirm('Reset garden for essence?')) {
      this.gameService.prestige();
    }
  }
}
