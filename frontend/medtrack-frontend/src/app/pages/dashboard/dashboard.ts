import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PatientService } from '../../services/patients.service';
import { ConsultationService } from '../../services/consultation.service';
import { ExamenService } from '../../services/examen.service';
import { Activite } from '../../models/dashboard.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthRoleService } from '../../services/auth-role.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  today = new Date();

  stats = [
    { label: 'Patients actifs', valeur: 0, icon: 'bi-people-fill', couleur: 'primary', route: '/patients' },
    { label: 'Patients inactifs', valeur: 0, icon: 'bi-people-fill', couleur: 'danger', route: '/patients' },
    { label: 'Consultations', valeur: 0, icon: 'bi-clipboard2-pulse-fill', couleur: 'success', route: '/consultations' },
    { label: 'Examens ', valeur: 0, icon: 'bi-droplet-fill', couleur: 'warning', route: '/examens' },
  ];
 statsExamens = { total: 0, enAttente: 0, realises: 0 };
  activitesRecentes: Activite[] = [];
  raccourcis = [
    { label: 'Nouveau patient', icon: 'bi-person-plus-fill', route: '/patients/nouveau', couleur: 'primary' },
    { label: 'Nouvelle consultation', icon: 'bi-clipboard2-plus-fill', route: '/consultations/nouveau', couleur: 'success' },
    { label: 'Prescrire examen', icon: 'bi-droplet-fill', route: '/examens/nouveau', couleur: 'warning' },
    { label: 'Admettre patient', icon: 'bi-hospital-fill', route: '/hospitalisations/nouveau', couleur: 'danger' },
  ];

  constructor(
    private patientService: PatientService,
    private consultationService: ConsultationService,
    private examenService: ExamenService,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    public roleService:AuthRoleService
    

  ) {}
  profil: any = null;


  ngOnInit(): void {
    this.profil = JSON.parse(localStorage.getItem('profil') || 'null');

    this.chargerStats();
  }

  chargerStats(): void {
    // Patients actifs
    this.patientService.getPatients().subscribe({
      next: (data) => {
        this.stats[0].valeur = data.filter(p => p.est_actif).length;
        data.slice(0,2).forEach(p=>{
          this.activitesRecentes.push({
            message:`Patient enregistrer-${p.prenom} ${p.nom}`,
            temps:p.date_enregistrement ? new Date(p.date_enregistrement).toLocaleDateString('fr-Fr'):'',
            icon:'bi-person-plus-fill',
            couleur:'primary'
          });
        });
        this.cdr.detectChanges();
      }
    });
    // Assignations reçues (pour médecin spécialiste)
this.http.get<any[]>(`${environment.apiUrl}/assignations-medecin/`).subscribe({
  next: (data) => {
    const recues = data.filter(a => a.est_active);
    if (recues.length > 0) {
      recues.forEach(a => {
        this.activitesRecentes.push({
          message: `Patient référé — ${a.patient_prenom} ${a.patient_nom}`,
          temps: new Date(a.date_assignation).toLocaleDateString('fr-FR'),
          icon: 'bi-person-badge-fill',
          couleur: 'primary'
        });
      });
      this.activitesRecentes = this.activitesRecentes.slice(0, 5);
      this.cdr.detectChanges();
    }
  }
});

    // Consultations
    this.consultationService.getAll().subscribe({
      next: (data) => {
        this.stats[1].valeur = data.length;
        data.slice(0, 2).forEach(c => {
          this.activitesRecentes.push({
            message: `Consultation — ${c.patient_prenom} ${c.patient_nom} : ${c.motif}`,
            temps: new Date(c.date_consultation).toLocaleDateString('fr-FR'),
            icon: 'bi-clipboard2-pulse-fill',
            couleur: 'success'
          });
        });
        this.activitesRecentes = this.activitesRecentes.slice(0, 5);
        this.cdr.detectChanges();
      }
    });

  

  

    // Hospitalisations en cours
   
  }
}