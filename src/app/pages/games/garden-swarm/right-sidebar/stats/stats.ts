import { Component, ChangeDetectionStrategy } from '@angular/core';
import { GameService } from '@core/services/game';

@Component({
  selector: 'app-stats',
  standalone: true,
  templateUrl: './stats.html',
  styleUrl: './stats.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Stats {
  constructor(public gameService: GameService) {}

  prestigeConfirm() {
    if (confirm('Reset garden for essence?')) {
      this.gameService.prestige();
    }
  }
}
