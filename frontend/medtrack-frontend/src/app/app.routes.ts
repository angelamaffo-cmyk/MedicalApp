import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { LoginComponent } from './pages/login/login';
import { AccueilComponent } from './pages/accueil/accueil';

export const routes: Routes = [
     // Page d'accueil publique
  { path: 'accueil', component: AccueilComponent },
     // Route publique
  { path: 'login', component: LoginComponent },

  // Routes privées
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard').then(m => m.DashboardComponent)
  },
  {
    path: 'patients',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/patients/liste-patients/liste-patients').then(m => m.ListePatientsComponent)
  },
  {
    path: 'patients/nouveau',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/patients/form-patient/form-patient').then(m => m.FormPatientComponent)
  },
  {
    path: 'patients/modifier/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/patients/form-patient/form-patient').then(m => m.FormPatientComponent)
  },
  {
    path: 'changer-mot-de-passe',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/comptes/changer-mot-de-passe/changer-mot-de-passe').then(m => m.ChangerMotDePasseComponent)
  },

  // Redirections
  { path: '', redirectTo: '/acueil', pathMatch: 'full' },
  { path: '**', redirectTo: '/accueil' }
];

