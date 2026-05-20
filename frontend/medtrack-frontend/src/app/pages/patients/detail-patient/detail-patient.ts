import { Component, OnInit,ChangeDetectorRef } from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  RouterLink,
  ActivatedRoute,
  Router
} from '@angular/router';

import { PatientService } from '../../../services/patients.service';

import { Patients } from '../../../models/patients.model';

@Component({
  selector: 'app-detail-patient',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detail-patient.html',
  styleUrl: './detail-patient.css',
})

export class DetailPatientComponent implements OnInit {

  patient: Patients | null = null;

  isLoading = false;

  patientId!: number ;

  confirmDesactiver = false;

  successMessage = '';
  errorMessage = '';


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patientService: PatientService,
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

          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },

        error: (err) => {

          console.error(err);
           this.cdr.detectChanges();
        }
      });
  }
}