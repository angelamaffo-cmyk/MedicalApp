import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PatientService } from '../../services/patients.service';
import { ConsultationService } from '../../services/consultation.service';
import { ExamenService } from '../../services/examen.service';
import { HospitalisationsService } from '../../services/hospitalisations.service';
import { Activite } from '../../models/dashboard.model';
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
    { label: 'Consultations', valeur: 0, icon: 'bi-clipboard2-pulse-fill', couleur: 'success', route: '/consultations' },
    { label: 'Examens en attente', valeur: 0, icon: 'bi-droplet-fill', couleur: 'warning', route: '/examens' },
    { label: 'Hospitalisations en cours', valeur: 0, icon: 'bi-hospital-fill', couleur: 'danger', route: '/hospitalisations' },
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
    private hospitalisationService: HospitalisationsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
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

    // Examens en attente
    this.examenService.getAll().subscribe({
      next: (data) => {
        this.statsExamens.total = data.length;
        this.statsExamens.enAttente = data.filter(e => !e.date_realisation).length;
        this.statsExamens.realises = data.filter(e => !!e.date_realisation).length;
        this.stats[2].valeur = this.statsExamens.enAttente;
        this.cdr.detectChanges();
      }
    });

  

    // Hospitalisations en cours
    this.hospitalisationService.getAll().subscribe({
      next: (data) => {
        this.stats[3].valeur = data.filter(h => h.statut === 'EN_COURS').length;
        this.cdr.detectChanges();
      }
    });
  }
}