import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';

import { PatientService }      from '../../services/patients.service';
import { ConsultationService } from '../../services/consultation.service';
import { ExamenService }       from '../../services/examen.service';
import { ResultatsService }    from '../../services/resultats.service';
import { AuthRoleService }     from '../../services/auth-role.service';
import { environment }         from '../../../environments/environment';
import { Activite }            from '../../models/dashboard.model';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('chartConsult') chartConsultRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartDonut')   chartDonutRef!:   ElementRef<HTMLCanvasElement>;

  today   = new Date();
  profil: any = null;
  isLoading   = true;

  // ── Stats ────────────────────────────────
  stats = [
    { label: 'Patients actifs',  valeur: 0, icon: 'bi-people-fill',           couleur: 'primary', route: '/patients'      },
    { label: 'Consultations',    valeur: 0, icon: 'bi-clipboard2-pulse-fill',  couleur: 'success', route: '/consultations'  },
    { label: 'Examens',          valeur: 0, icon: 'bi-droplet-fill',           couleur: 'warning', route: '/examens'        },
    { label: 'Résultats',        valeur: 0, icon: 'bi-file-medical-fill',      couleur: 'info',    route: '/resultats'      },
  ];

  totalExamensAttente   = 0;
  totalResultatsAnormaux = 0;

  // ── Graphiques ───────────────────────────
  consultationsParMois: number[] = Array(6).fill(0);
  examensParMois:       number[] = Array(6).fill(0);
  typesExamens: Record<string, number> = {
  };
  totalSoins       = 0;
soinsEnCours     = 0;
soinsTermines    = 0;
totalPersonnel   = 0;
totalMedecins    = 0;
totalInfirmiers  = 0;
// Palette de couleurs pour les types (s'adapte à n'importe quelle valeur)
readonly paletteTypes = [
  '#378add', '#10b981', '#f59e0b', '#ef4444',
  '#8b5cf6', '#06b6d4', '#f97316', '#888780'
];
typeCouleurs: Record<string, string> = {};
  // ── Activités ────────────────────────────
  activitesRecentes: Activite[] = [];

  raccourcis = [
    { label: 'Nouveau patient',      icon: 'bi-person-plus-fill',    route: '/patients/nouveau',      couleur: 'primary', bg: 'rgba(26,115,232,0.1)',  color: '#1a73e8' },
    { label: 'Nouvelle consultation',icon: 'bi-clipboard2-plus-fill', route: '/consultations/nouveau', couleur: 'success', bg: 'rgba(16,185,129,0.1)',  color: '#10b981' },
    { label: 'Prescrire examen',     icon: 'bi-droplet-fill',         route: '/examens/nouveau',       couleur: 'warning', bg: 'rgba(245,158,11,0.1)', color: '#f59e0b' },
    { label: 'Saisir résultat',      icon: 'bi-file-medical-fill',    route: '/resultats/nouveau',     couleur: 'success', bg: 'rgba(16,185,129,0.1)',  color: '#10b981' },
  ];

  private chartConsult?: Chart;
  private chartDonut?:   Chart;
  private chargesTerminees = 0;
  private readonly TOTAL_CHARGES = 6;

 

  constructor(
    private patientService:      PatientService,
    private consultationService: ConsultationService,
    private examenService:       ExamenService,
    private resultatsService:    ResultatsService,
    private cdr:                 ChangeDetectorRef,
    private http:                HttpClient,
    public  roleService:         AuthRoleService,
  ) {}

  ngOnInit(): void {
    this.profil = JSON.parse(localStorage.getItem('profil') || 'null');
    this.chargerStats();
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.chartConsult?.destroy();
    this.chartDonut?.destroy();
  }

  // ─────────────────────────────────────────
  // CHARGEMENT
  // ─────────────────────────────────────────
  private verifierChargement(): void {
    this.chargesTerminees++;
    if (this.chargesTerminees >= this.TOTAL_CHARGES) {
      this.isLoading = false;
      this.cdr.detectChanges();
      setTimeout(() => this.creerGraphiques(), 150);
    }
  }

  chargerStats(): void {
    this.isLoading = true;
    this.chargesTerminees = 0;

    // ── Patients ──
    this.patientService.getPatients().subscribe({
      next: (data) => {
        this.stats[0].valeur = data.filter((p: any) => p.est_actif).length;
        data.slice(0, 3).forEach((p: any) => {
          this.activitesRecentes.push({
            message: `Patient enregistré — ${p.prenom} ${p.nom}`,
            temps:   p.date_enregistrement
              ? new Date(p.date_enregistrement).toLocaleDateString('fr-FR') : '',
            icon:    'bi-person-plus-fill',
            couleur: 'primary',
          });
        });
        this.verifierChargement();
      },
      error: () => this.verifierChargement()
    });

    // ── Assignations médecin ──
    this.http.get<any[]>(`${environment.apiUrl}/patients/assigner-medecin/`).subscribe({
      next: (data) => {
        data.filter((a: any) => a.est_active).forEach((a: any) => {
          this.activitesRecentes.push({
            message: `Patient référé — ${a.patient_prenom} ${a.patient_nom}`,
            temps:   new Date(a.date_assignation).toLocaleDateString('fr-FR'),
            icon:    'bi-person-badge-fill',
            couleur: 'primary',
          });
        });
        this.activitesRecentes = this.activitesRecentes.slice(0, 5);
        this.cdr.detectChanges();
      },
      error: () => {}
    });

    // ── Consultations ──
    this.consultationService.getAll().subscribe({
      next: (data) => {
        this.stats[1].valeur = data.length;
        this.calculerConsultationsParMois(data);
        data.slice(0, 2).forEach((c: any) => {
          this.activitesRecentes.push({
            message: `Consultation — ${c.patient_prenom} ${c.patient_nom} : ${c.motif}`,
            temps:   new Date(c.date_consultation).toLocaleDateString('fr-FR'),
            icon:    'bi-clipboard2-pulse-fill',
            couleur: 'success',
          });
        });
        this.activitesRecentes = this.activitesRecentes.slice(0, 5);
        this.verifierChargement();
      },
      error: () => this.verifierChargement()
    });

    // ── Examens ──
    this.examenService.getAll().subscribe({
      next: (data) => {
        this.stats[2].valeur      = data.length;
        this.totalExamensAttente  = data.filter((e: any) => !e.date_realisation).length;
        this.calculerExamensParMois(data);
        this.calculerTypesExamens(data);
        data.slice(0, 2).forEach((e: any) => {
          this.activitesRecentes.push({
            message: `Examen — ${e.patient_prenom} ${e.patient_nom} : ${e.nom_examen}`,
            temps:   new Date(e.date_prescription).toLocaleDateString('fr-FR'),
            icon:    e.date_realisation ? 'bi-check-circle-fill' : 'bi-hourglass-split',
            couleur: e.date_realisation ? 'success' : 'danger',
          });
        });
        this.activitesRecentes = this.activitesRecentes.slice(0, 5);
        this.verifierChargement();
      },
      error: () => this.verifierChargement()
    });

    // ── Résultats ──
    this.resultatsService.getAll().subscribe({
      next: (data) => {
        this.stats[3].valeur          = data.length;
        this.totalResultatsAnormaux   = data.filter((r: any) => !r.est_normal).length;
        this.verifierChargement();
      },
      error: () => this.verifierChargement()
    });

    // ── Soins / Assignations ──
    this.http.get<any[]>(`${environment.apiUrl}patients/assigner-infirmier/`).subscribe({
      next: (data) => {
      this.totalSoins     = data.length;
      this.soinsEnCours   = data.filter((s: any) => s.statut_soins === 'EN_COURS').length;
      this.soinsTermines  = data.filter((s: any) => s.statut_soins === 'TERMINE').length;
      this.verifierChargement();
    },
    error: () => this.verifierChargement()
    });

    // ── Personnel ──
    this.http.get<any[]>(`${environment.apiUrl}/personnel/`).subscribe({
      next: (data) => {
      this.totalPersonnel  = data.length;
      this.totalMedecins   = data.filter((p: any) => p.role === 'MEDECIN').length;
      this.totalInfirmiers = data.filter((p: any) => p.role === 'INFIRMIER').length;
      this.verifierChargement();
    },
    error: () => this.verifierChargement()
    });
  }

  // ─────────────────────────────────────────
  // CALCULS
  // ─────────────────────────────────────────
  private calculerConsultationsParMois(data: any[]): void {
    const actuel = new Date().getMonth();
    const c = Array(6).fill(0);
    data.forEach((item: any) => {
      const idx = new Date(item.date_consultation).getMonth() - (actuel - 5);
      if (idx >= 0 && idx < 6) c[idx]++;
    });
    this.consultationsParMois = c;
  }

  private calculerExamensParMois(data: any[]): void {
    const actuel = new Date().getMonth();
    const c = Array(6).fill(0);
    data.forEach((item: any) => {
      const idx = new Date(item.date_prescription).getMonth() - (actuel - 5);
      if (idx >= 0 && idx < 6) c[idx]++;
    });
    this.examensParMois = c;
  }

  private calculerTypesExamens(data: any[]): void {
    const types: Record<string, number> = {
    };
    data.forEach((e: any) => {
      const t = e.type_examen || 'Autre';
       types[t] = (types[t] || 0) +1;
    });
    this.typesExamens = types;
     Object.keys(types).forEach((key, i) => {
    this.typeCouleurs[key] = this.paletteTypes[i % this.paletteTypes.length];
  });
  }

  get labelsMois(): string[] {
    const noms = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];
    const actuel = new Date().getMonth();
    return Array.from({ length: 6 }, (_, i) => noms[(actuel - 5 + i + 12) % 12]);
  }
get typesExamensKeys(): string[] {
  return Object.keys(this.typesExamens)
    .sort((a, b) => this.typesExamens[b] - this.typesExamens[a]); // tri décroissant
}
get typesExamensVals(): number[] {
  return this.typesExamensKeys.map(k => this.typesExamens[k]);
}
get totalTypes(): number {
  return this.typesExamensVals.reduce((a, b) => a + b, 0) || 1;
}
getPct(v: number): number {
  return Math.round((v / this.totalTypes) * 100);
}
  // ─────────────────────────────────────────
  // GRAPHIQUES
  // ─────────────────────────────────────────
  private creerGraphiques(): void {
    if (this.chartConsultRef) this.creerChartBar();
    if (this.chartDonutRef)   this.creerChartDonut();
  }

  private creerChartBar(): void {
    this.chartConsult?.destroy();
    const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const grid = dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
    const txt  = dark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.4)';

    this.chartConsult = new Chart(this.chartConsultRef.nativeElement, {
      type: 'bar',
      data: {
        labels: this.labelsMois,
        datasets: [
          {
            label: 'Consultations',
            data: this.consultationsParMois,
            backgroundColor: '#378add',
            borderRadius: 6,
            borderSkipped: false,
          },
          {
            label: 'Examens',
            data: this.examensParMois,
            type: 'line' as any,
            borderColor: '#10b981',
            backgroundColor: 'transparent',
            borderWidth: 2.5,
            tension: 0.4,
            pointBackgroundColor: '#10b981',
            pointRadius: 4,
            borderDash: [5, 3],
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { mode: 'index', intersect: false }
        },
        scales: {
          x: { grid: { color: grid }, ticks: { color: txt, font: { size: 11 } } },
          y: { beginAtZero: true, grid: { color: grid }, ticks: { color: txt, font: { size: 11 }, stepSize: 1 } }
        }
      }
    });
  }

  private creerChartDonut(): void {
    this.chartDonut?.destroy();
    if (!this.chartDonutRef) return;

    const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const keys   = this.typesExamensKeys;
    const vals   = this.typesExamensVals;
    const colors = keys.map(k => this.typeCouleurs[k] || '#888780');

    this.chartDonut = new Chart(this.chartDonutRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: keys,
        datasets: [{
          data: vals.some(v => v > 0) ? vals : [1],
          backgroundColor: vals.some(v => v >0) ? colors : ['#888780'],
          borderWidth: 2,
          borderColor: dark ? '#1a1f3e' : '#ffffff',
          hoverOffset: 6,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label} : ${ctx.parsed} (${this.getPct(ctx.parsed)}%)`
            }
          }
        }
      }
    });
  }
}