import { Component, ChangeDetectionStrategy } from '@angular/core';
import { GameService } from '@core/services/game';
import {Plant} from '@core/models/plant';

@Component({
  selector: 'app-grid',
  standalone: true,
  templateUrl: './grid.html',
  styleUrl: './grid.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Grid {
  constructor(public gameService: GameService) {}

  harvest(plant: Plant) {
    this.gameService.blooms.update(b => b.add(plant.production.mul(plant.count).div(10)));
  }

  manualHarvest() {
    this.gameService.blooms.update(b => b.add(1)); // Initial 1 bloom per click
  }
}
