import { Component, OnInit,ChangeDetectorRef } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ResultatsService } from '../../../services/resultats.service';
import {
  RouterLink,
  ActivatedRoute,
  Router
} from '@angular/router';

import { PatientService } from '../../../services/patients.service';

import { Patients } from '../../../models/patients.model';
import { ConsultationService } from '../../../services/consultation.service';
import { ExamenService } from '../../../services/examen.service';
import { HospitalisationsService} from '../../../services/hospitalisations.service';
import { Consultation } from '../../../models/consultations.model';
import { Examen } from '../../../models/examens.model';
import { Hospitalisation } from '../../../models/hospitalisations.model';
@Component({
  selector: 'app-detail-patient',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detail-patient.html',
  styleUrl: './detail-patient.css',
})

export class DetailPatientComponent implements OnInit {

  patient: Patients | null = null;
  consultations: Consultation[] = [];
  examens: Examen[] = [];
  hospitalisations: Hospitalisation[] = [];

  isLoading = false;

  patientId!: number ;

  confirmDesactiver = false;

  successMessage = '';
  errorMessage = '';
ongletActif = 'infos'; 

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patientService: PatientService,
    private consultationService: ConsultationService,
    private examenService: ExamenService,
    private hospitalisationService: HospitalisationsService,
    private resultatService: ResultatsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.patientId=Number(id);

      this.chargerPatient();
    }
  }

  chargerPatient(): void {

   

    this.isLoading = true;

    this.patientService.getPatient(this.patientId).subscribe({

      next: (data) => {

        this.patient = data;

        this.isLoading = false;
         this.cdr.detectChanges();
      },

      error: (err) => {

        console.error(err);
        this.errorMessage = 'Impossible de charger le patient';


        this.isLoading = false;
         this.cdr.detectChanges();
      }
    });
  }
  changerOnglet(onglet: string): void {
    this.ongletActif = onglet;
    if (onglet === 'consultations' && this.consultations.length === 0) {
      this.chargerConsultations();
    }
    if (onglet === 'examens' && this.examens.length === 0) {
      this.chargerExamens();
    }
    if (onglet === 'hospitalisations' && this.hospitalisations.length === 0) {
      this.chargerHospitalisations();
    }
  }
chargerConsultations(): void {
    this.consultationService.getAll().subscribe({
      next: (data) => {
        this.consultations = data.filter(c => c.patient === this.patientId);
        this.cdr.detectChanges();
      }
    });
  }
  chargerExamens(): void {
  this.examenService.getAll().subscribe({
    next: (examensData) => {
      this.resultatService.getAll().subscribe({
        next: (resultatsData) => {
          this.examens = examensData
            .filter(e => this.consultations.some(c => Number(c.id) === Number(e.consultation)))
            .map(e => ({
              ...e,
              a_resultat: resultatsData.some(r => Number(r.examen) === Number(e.id))
            }));
          this.cdr.detectChanges();
        }
      });
    }
  });

  }
  chargerHospitalisations(): void {
    this.hospitalisationService.getAll().subscribe({
      next: (data) => {
        this.hospitalisations = data.filter(h => h.patient === this.patientId);
        this.cdr.detectChanges();
      }
    });
  }

  calculerAge(dateNaissance: string): number {

    const today = new Date();

    const naissance = new Date(dateNaissance);

    let age = today.getFullYear() - naissance.getFullYear();

    if (
      today <
      new Date(
        today.getFullYear(),
        naissance.getMonth(),
        naissance.getDate()
      )
    ) {
      age--;
    }

    return age;
  }

  toggleStatut(): void {

    if (!this.patient ) return;

    const updatedPatient = {
      ...this.patient,
      est_actif: !this.patient.est_actif
    };

    this.patientService
      .updatePatient(this.patient.id!
        , updatedPatient)
      .subscribe({

        next: (data) => {

          this.patient = data;

          this.confirmDesactiver = false;

          this.successMessage = 'Statut modifié avec succès';
           this.cdr.detectChanges();
        },
        error: (err) => console.error(err)
    });
  }

         
       
      getStatutLabel(statut: string): string {
    const labels: any = { 'EN_COURS': 'En cours', 'SORTI': 'Sorti', 'TRANSFERE': 'Transféré', 'DECEDE': 'Décédé' };
    return labels[statut] || statut;
  }

  getStatutColor(statut: string): string {
    const colors: any = { 'EN_COURS': 'warning', 'SORTI': 'success', 'TRANSFERE': 'info', 'DECEDE': 'danger' };
    return colors[statut] || 'secondary';
  }
}