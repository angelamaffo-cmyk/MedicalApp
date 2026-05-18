import { Component , OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  
}
stats = [
    { label: 'Patients actifs', valeur: 3, icon: 'bi-people-fill', couleur: 'primary', route: '/patients' },
    { label: 'Consultations aujourd\'hui', valeur: 8, icon: 'bi-clipboard2-pulse-fill', couleur: 'success', route: '/consultations' },
    { label: 'Examens en attente', valeur: 5, icon: 'bi-droplet-fill', couleur: 'warning', route: '/examens' },
    { label: 'Hospitalisations en cours', valeur: 12, icon: 'bi-hospital-fill', couleur: 'danger', route: '/hospitalisations' },
  ];

  activitesRecentes = [
    { type: 'patient', message: 'Nouveau patient enregistré — Kamga Jean', temps: 'Il y a 10 min', icon: 'bi-person-plus-fill', couleur: 'primary' },
    { type: 'consultation', message: 'Consultation terminée — Maffo Angela', temps: 'Il y a 25 min', icon: 'bi-clipboard2-check-fill', couleur: 'success' },
    { type: 'examen', message: 'Résultat examen reçu — Tchoupo Marie', temps: 'Il y a 1h', icon: 'bi-file-medical-fill', couleur: 'warning' },
    { type: 'hospitalisation', message: 'Patient admis — Nguemo Paul', temps: 'Il y a 2h', icon: 'bi-hospital-fill', couleur: 'danger' },
    { type: 'patient', message: 'Dossier modifié — Biya Hélène', temps: 'Il y a 3h', icon: 'bi-pencil-fill', couleur: 'info' },
  ];

  raccourcis = [
    { label: 'Nouveau patient', icon: 'bi-person-plus-fill', route: '/patients/nouveau', couleur: 'primary' },
    { label: 'Nouvelle consultation', icon: 'bi-clipboard2-plus-fill', route: '/consultations', couleur: 'success' },
    { label: 'Prescrire examen', icon: 'bi-droplet-fill', route: '/examens', couleur: 'warning' },
    { label: 'Admettre patient', icon: 'bi-hospital-fill', route: '/hospitalisations', couleur: 'danger' },
  ];
   ngOnInit(): void {}
}
