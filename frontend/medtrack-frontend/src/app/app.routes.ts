import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { LoginComponent } from './pages/login/login';
import { AccueilComponent } from './pages/accueil/accueil';
import { MainLayoutComponent } from './layout/main-layout/main-layout';


export const routes: Routes = [
   // Pages publiques
  { path: 'accueil', component: AccueilComponent },
  { path: 'login', component: LoginComponent },
  { path: 'changer-mot-de-passe', loadComponent: () =>
      import('./pages/comptes/changer-mot-de-passe/changer-mot-de-passe').then(m => m.ChangerMotDePasseComponent)
  },

  // Pages privées avec layout
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () =>
          import('./pages/dashboard/dashboard').then(m => m.DashboardComponent)
      },
      { path: 'patients', loadComponent: () =>
          import('./pages/patients/liste-patients/liste-patients').then(m => m.ListePatientsComponent)
      },
      { path: 'patients/nouveau', loadComponent: () =>
          import('./pages/patients/form-patient/form-patient').then(m => m.FormPatientComponent)
      },
      { path: 'patients/modifier/:id', loadComponent: () =>
          import('./pages/patients/form-patient/form-patient').then(m => m.FormPatientComponent)
      },
      { path: 'profil', loadComponent: () =>
          import('./pages/comptes/profil/profil').then(m => m.ProfilComponent)
      },
    ]
  },

  // Redirections
  { path: '', redirectTo: '/accueil', pathMatch: 'full' },
  { path: '**', redirectTo: '/accueil' }
];

