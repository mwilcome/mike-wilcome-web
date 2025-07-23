import { Component } from '@angular/core';
import { GameService } from '@core/services/game';
import { ChangeDetectionStrategy } from '@angular/core';
import {Grid} from './grid/grid';
import {Upgrades} from './upgrades/upgrades';
import {Stats} from './stats/stats';

@Component({
  selector: 'app-garden-swarm',
  standalone: true,
  templateUrl: './garden-swarm.html',
  styleUrl: './garden-swarm.scss',
  imports: [
    Grid,
    Upgrades,
    Stats
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GardenSwarm {
  constructor(public gameService: GameService) {}
}
