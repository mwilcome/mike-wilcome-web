import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { Games } from './pages/games/games';
import { GardenSwarm } from './pages/games/garden-swarm/garden-swarm';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'games', component: Games, children: [
      { path: 'garden-swarm', component: GardenSwarm }
    ] },
  { path: '**', redirectTo: '' }
];
