import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';

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
    patientId: number | null = null;
    successMessage = '';
    errorMessage = '';
    constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
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
    this.patientId = this.route.snapshot.params['id'];
    if (this.patientId) {
      this.isEditMode = true;
      // Simulation données existantes
         this.form.patchValue({
        nom: 'Temgoua',
        prenom: 'Belmisse',
        sexe: 'F',
        date_naissance: '2000-01-15',
        telephone: '677000001',
        adresse: 'Yaoundé, Cameroun',
        groupe_sanguin: 'A+',
        contact_urgence_nom: 'Maffo Paul',
        contact_urgence_telephone: '699000099',
      });
    }
  }
   get nom() { return this.form.get('nom'); }
  get prenom() { return this.form.get('prenom'); }
  get sexe() { return this.form.get('sexe'); }
  get date_naissance() { return this.form.get('date_naissance'); }
  get telephone() { return this.form.get('telephone'); }
  get groupe_sanguin() { return this.form.get('groupe_sanguin'); }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';

    // Simulation sauvegarde
    setTimeout(() => {
      this.isLoading = false;
      this.successMessage = this.isEditMode
        ? 'Patient modifié avec succès !'
        : 'Patient créé avec succès !';
      setTimeout(() => this.router.navigate(['/patients']), 1500);
    }, 1000);
  }
  
}
