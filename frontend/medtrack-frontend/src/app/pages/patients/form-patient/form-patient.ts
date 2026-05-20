import { PatientService } from './../../../services/patients.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';

import { Patients } from '../../../models/patients.model';
@Component({
  selector: 'app-form-patient',
  standalone:true,
  imports: [CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './form-patient.html',
  styleUrl: './form-patient.css',
})
export class FormPatientComponent implements OnInit {
    form: FormGroup;
    isLoading = false;
    isEditMode = false;
    patientId!: number;
    successMessage = '';
    errorMessage = '';
    constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private patientService: PatientService
  ) {
      this.form = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      sexe: ['', Validators.required],
      date_naissance: ['', Validators.required],
      telephone: ['', [Validators.required, Validators.minLength(8)]],
      adresse: [''],
      groupe_sanguin: ['', Validators.required],
      contact_urgence_nom: [''],
      contact_urgence_telephone: [''],
    });
  }
   ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.patientId=Number(id);
      this.isEditMode = true;
      this.chargerPatient();
    }
  }

  chargerPatient(): void {

    

    this.isLoading = true;

    this.patientService.getPatient(this.patientId).subscribe({

      next: (patient) => {

        this.form.patchValue(patient);

        this.isLoading = false;
      },
       error: (err) => {

        console.error(err);
        this.errorMessage = 'Impossible de charger le patient';


        this.isLoading = false;
      }
    });
  }
  get nom() {
  return this.form.get('nom');
}

get prenom() {
  return this.form.get('prenom');
}

get sexe() {
  return this.form.get('sexe');
}

get date_naissance() {
  return this.form.get('date_naissance');
}

get telephone() {
  return this.form.get('telephone');
}

get groupe_sanguin() {
  return this.form.get('groupe_sanguin');
}
  onSubmit(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;
    }
     this.isLoading = true;

    if (this.isEditMode ) {

      this.patientService
        .updatePatient(this.patientId, this.form.value)
        .subscribe({

          next: () => {

            this.isLoading = false;

            this.router.navigate(['/patients']);
          },
          error: (err) => {

            console.error(err);
            this.errorMessage = 'Erreur lors de la modification';


            this.isLoading = false;
          }
        });

    } else {
      this.patientService
        .createPatient(this.form.value)
        .subscribe({

          next: () => {

            this.isLoading = false;

            this.router.navigate(['/patients']);
          },

          error: (err) => {

            console.error(err);
            this.errorMessage = 'Erreur lors de la création';

            this.isLoading = false;
          }
        });
    }
  }
}
      