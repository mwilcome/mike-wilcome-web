import { Component, ChangeDetectionStrategy } from '@angular/core';
import { GameService } from '@core/services/game';
import { TopBar } from './top-bar/top-bar';
import { GardenGrid } from './grid/garden-grid';
import { LeftSidebar } from './left-sidebar/left-sidebar';
import { RightSidebar } from './right-sidebar/right-sidebar';
import { BottomBar } from './bottom-bar/bottom-bar';

@Component({
  selector: 'app-garden-swarm',
  standalone: true,
  imports: [TopBar, GardenGrid, LeftSidebar, RightSidebar, BottomBar],
  templateUrl: './garden-swarm.html',
  styleUrl: './garden-swarm.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GardenSwarm {
  constructor(public gameService: GameService) {}
}
