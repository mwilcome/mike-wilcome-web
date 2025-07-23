import { Component, ChangeDetectionStrategy } from '@angular/core';
import { GameService } from '@core/services/game';

@Component({
  selector: 'app-upgrades',
  standalone: true,
  templateUrl: './upgrades.html',
  styleUrl: './upgrades.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Upgrades {
  constructor(public gameService: GameService) {}
}
