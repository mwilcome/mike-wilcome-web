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
    effect(() => {
      const weather = this.gameService.weather();
      this.generateParticles(weather);
    });
  }

  particles = signal<any[]>([]);

  generateParticles(weather: string) {
    const newParticles: any[] = [];
    switch (weather) {
      case 'sunny':
        for (let i = 0; i < 5; i++) {
          newParticles.push({
            type: 'petal',
            left: Math.random() * 100,
            top: Math.random() * 100,
            delay: Math.random() * 5
          });
        }
        for (let i = 0; i < 3; i++) {
          newParticles.push({
            type: 'bee',
            left: Math.random() * 100,
            top: Math.random() * 100,
            delay: Math.random() * 3
          });
        }
        break;
      case 'rainy':
        for (let i = 0; i < 8; i++) {
          newParticles.push({
            type: 'rain',
            left: Math.random() * 100,
            top: -10,
            delay: Math.random() * 2
          });
        }
        break;
      case 'stormy':
        for (let i = 0; i < 5; i++) {
          newParticles.push({
            type: 'cloud',
            left: Math.random() * 100,
            top: Math.random() * 20,
            delay: Math.random() * 5
          });
        }
        break;
    }
    this.particles.set(newParticles);
  }
}
