import { Component, ChangeDetectionStrategy } from '@angular/core';
import { GameService } from '@core/services/game';
import { Grid } from './grid/grid';
import { Upgrades } from './upgrades/upgrades';
import { Stats } from './stats/stats';

@Component({
  selector: 'app-garden-swarm',
  standalone: true,
  imports: [Grid, Upgrades, Stats],
  templateUrl: './garden-swarm.html',
  styleUrl: './garden-swarm.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GardenSwarm {
  constructor(public gameService: GameService) {}
}
