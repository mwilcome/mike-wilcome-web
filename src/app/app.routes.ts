import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/landing/landing').then(m => m.Landing) },

  // Labs section (hub + child labs)
  { path: 'labs', loadChildren: () => import('./pages/labs/labs.routes').then(m => m.LABS_ROUTES) },

  // Bad Designs section
  { path: 'bad-designs', loadChildren: () => import('./pages/bad-designs/bad-designs.routes').then(m => m.BAD_DESIGNS_ROUTES) },

  { path: '**', redirectTo: '' }
];
