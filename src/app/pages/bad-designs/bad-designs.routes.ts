import { Routes } from '@angular/router';

export const BAD_DESIGNS_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./bad-designs').then(m => m.BadDesigns) },

  { path: '**', redirectTo: '' }
];
