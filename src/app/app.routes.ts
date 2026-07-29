import { Routes } from '@angular/router';
import { Landing } from './landing/landing';

export const routes: Routes = [
  { path: 'landing', component: Landing },
  { path: '', redirectTo: '/landing', pathMatch: 'full' }
];
