import { Component, ChangeDetectionStrategy } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { GameService } from '@core/services/game';
import { Plant } from '@core/models/plant';
import Big from 'big.js';

@Component({
  selector: 'app-garden-grid',
  standalone: true,
  animations: [
    trigger('plantSway', [
      transition(':enter', [
        style({ transform: 'translateY(0)' }),
        animate('1s ease-out', style({ transform: 'translateY(-10px)' }))
      ]),
      transition('* => *', [
        animate('2s ease-in-out', style({ transform: 'rotate(5deg)' })),
        animate('2s ease-in-out', style({ transform: 'rotate(-5deg)' }))
      ])
    ])
  ],
  templateUrl: './garden-grid.html',
  styleUrl: './garden-grid.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GardenGrid {
  constructor(public gameService: GameService) {}

  harvest(plant: Plant) {
    const totalHarvest = plant.production.mul(plant.count); // Full production per harvest, not 1/10th
    this.gameService.blooms.update(b => b.add(totalHarvest));
  }

  manualHarvest() {
    this.gameService.blooms.update(b => b.add(new Big(1)));
  }
}
