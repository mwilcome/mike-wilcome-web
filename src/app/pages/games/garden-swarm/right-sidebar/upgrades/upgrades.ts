import { Component, ChangeDetectionStrategy } from '@angular/core';
import { GameService } from '@core/services/game';
import Big from 'big.js';
import {TitleCasePipe} from '@angular/common';

@Component({
  selector: 'app-upgrades',
  standalone: true,
  templateUrl: './upgrades.html',
  styleUrl: './upgrades.scss',
  imports: [
    TitleCasePipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Upgrades {
  constructor(public gameService: GameService) {}

  buyPlant(plantId: string) {
    this.gameService.buyPlant(plantId);
    this.gameService.seeds.update(seeds => {
      const existing = seeds.find(s => s.id === plantId);
      if (existing) {
        return seeds.map(s => s.id === plantId ? { ...s, count: s.count.add(1) } : s);
      }
      return [...seeds, { id: plantId, count: new Big(1) }];
    });
  }
}
