import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/landing/landing').then(m => m.Landing) },
  { path: 'games', loadComponent: () => import('./pages/games/games').then(m => m.Games) },
  { path: 'garden-swarm', loadComponent: () => import('./pages/games/garden-swarm/garden-swarm').then(m => m.GardenSwarm) },
  { path: '**', redirectTo: '' }
];
