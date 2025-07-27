import { Component, ChangeDetectionStrategy, signal, effect } from '@angular/core';
import { GameService } from '@core/services/game';
import { TopBar } from './top-bar/top-bar';
import { GardenGrid } from './grid/garden-grid';
import { LeftSidebar } from './left-sidebar/left-sidebar';
import { RightSidebar } from './right-sidebar/right-sidebar';
import { BottomBar } from './bottom-bar/bottom-bar';
import {BackgroundOverlay} from './background-overlay/background-overlay';

@Component({
  selector: 'app-garden-swarm',
  standalone: true,
  imports: [TopBar, GardenGrid, LeftSidebar, RightSidebar, BottomBar, BackgroundOverlay],
  templateUrl: './garden-swarm.html',
  styleUrl: './garden-swarm.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GardenSwarm {
  constructor(public gameService: GameService) {
    // Removed generateBaseParticles() to avoid particle-related issues
    effect(() => {
      const weather = this.gameService.weather();
      if (weather) { // Keep the check in case weather logic is used elsewhere
        // Removed generateParticles() call to avoid crashes
      }
    });
  }

  particles = signal<any[]>([]); // Kept as a signal but unused for now
}
