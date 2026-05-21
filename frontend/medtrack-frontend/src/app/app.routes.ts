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
       { path: 'patients/:id', loadComponent: () =>
    import('./pages/patients/detail-patient/detail-patient').then(m => m.DetailPatientComponent)
    },
      { path: 'profil', loadComponent: () =>
          import('./pages/comptes/profil/profil').then(m => m.ProfilComponent)
      },
     
    { path: 'consultations', loadComponent: () =>
    import('./pages/consultations/liste-consultations/liste-consultations').then(m => m.ListeConsultationsComponent)
},
{ path: 'consultations/nouveau', loadComponent: () =>
    import('./pages/consultations/form-consultation/form-consultation').then(m => m.FormConsultationComponent)
},
{ path: 'consultations/modifier/:id', loadComponent: () =>
    import('./pages/consultations/form-consultation/form-consultation').then(m => m.FormConsultationComponent)
},
{ path: 'consultations/:id', loadComponent: () =>
    import('./pages/consultations/detail-consultation/detail-consultation').then(m => m.DetailConsultationComponent)
},
{ path: 'examens', loadComponent: () =>
    import('./pages/examens/liste-examens/liste-examens').then(m => m.ListeExamensComponent)
},
{ path: 'examens/nouveau', loadComponent: () =>
    import('./pages/examens/form-examen/form-examen').then(m => m.FormExamenComponent)
},
{ path: 'examens/modifier/:id', loadComponent: () =>
    import('./pages/examens/form-examen/form-examen').then(m => m.FormExamenComponent)
},
{ path: 'examens/:id', loadComponent: () =>
    import('./pages/examens/detail-examen/detail-examen').then(m => m.DetailExamenComponent)
},
{ path: 'resultats', loadComponent: () =>
    import('./pages/resultats/liste-resultats/liste-resultats').then(m => m.ListeResultatsComponent)
},
{ path: 'resultats/nouveau', loadComponent: () =>
    import('./pages/resultats/form-resultat/form-resultat').then(m => m.FormResultatComponent)
},
{ path: 'resultats/modifier/:id', loadComponent: () =>
    import('./pages/resultats/form-resultat/form-resultat').then(m => m.FormResultatComponent)
},
{ path: 'resultats/:id', loadComponent: () =>
    import('./pages/resultats/detail-resultat/detail-resultat').then(m => m.DetailResultatComponent)
},
{ path: 'hospitalisations', loadComponent: () =>
    import('./pages/hospitalisations/liste-hospitalisations/liste-hospitalisations').then(m => m.ListeHospitalisationsComponent)
},
{ path: 'hospitalisations/nouveau', loadComponent: () =>
    import('./pages/hospitalisations/form-hospitalisation/form-hospitalisation').then(m => m.FormHospitalisationComponent)
},
{ path: 'hospitalisations/modifier/:id', loadComponent: () =>
    import('./pages/hospitalisations/form-hospitalisation/form-hospitalisation').then(m => m.FormHospitalisationComponent)
},
{ path: 'hospitalisations/:id', loadComponent: () =>
    import('./pages/hospitalisations/detail-hospitalisation/detail-hospitalisation').then(m => m.DetailHospitalisationComponent)
},

    ]
  },

  // Redirections
  { path: '', redirectTo: '/accueil', pathMatch: 'full' },
  { path: '**', redirectTo: '/accueil' }
];

