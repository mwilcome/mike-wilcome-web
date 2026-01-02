import { Routes } from '@angular/router';

export const LABS_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./labs').then(m => m.Labs) },
  { path: 'signals', loadComponent: () => import('./signals/signals').then(m => m.SignalsLab) },
  { path: 'theme', loadComponent: () => import('./theme/theme').then(m => m.ThemeLab) },

  { path: '**', redirectTo: '' }
];
