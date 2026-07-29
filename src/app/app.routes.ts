import { Routes } from '@angular/router';
import { Landing } from './landing/landing';
import { LatestPaper } from './latestpaper/latestpaper';

export const routes: Routes = [
  { path: 'landing', component: Landing },
  { path: 'latestpaper', component: LatestPaper },
  { path: '', redirectTo: '/landing', pathMatch: 'full' }
];
