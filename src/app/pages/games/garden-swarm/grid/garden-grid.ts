import { Component, ChangeDetectionStrategy } from '@angular/core';
import { GameService } from '@core/services/game';
import { Plant } from '@core/models/plant';
import Big from 'big.js';

@Component({
  selector: 'app-garden-grid',
  standalone: true,
  templateUrl: './garden-grid.html',
  styleUrl: './garden-grid.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GardenGrid {
  constructor(public gameService: GameService) {}

  harvest(plant: Plant) {
    const totalHarvest = plant.production.mul(plant.count).div(10); // 1/10th production per harvest
    this.gameService.blooms.update(b => b.add(totalHarvest));
  }

  manualHarvest() {
    this.gameService.blooms.update(b => b.add(new Big(1))); // Initial 1 bloom per click
  }
}
