import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
@Component({
  selector: 'app-form-consultation',
  standalone:true,
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './form-consultation.html',
  styleUrl: './form-consultation.css',
})
export class FormConsultationComponent implements OnInit {
form: FormGroup;
  isLoading = false;
  isEditMode = false;
  consultationId: number | null = null;
  successMessage = '';
  errorMessage = '';

  // Simulation liste patients
  patients = [
    { id: 1, nom: 'Temgoua', prenom: 'Belmisse' },
    { id: 2, nom: 'Kamga', prenom: 'Jean' },
    { id: 3, nom: 'Tchoupo', prenom: 'Marie' },
  ];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
     this.form = this.fb.group({
      patient: ['', Validators.required],
      date_consultation: ['', Validators.required],
      motif: ['', [Validators.required, Validators.minLength(5)]],
      diagnostic: ['', Validators.required],
      traitement: [''],
      observations: [''],
    });
  }
   ngOnInit(): void {
    this.consultationId = this.route.snapshot.params['id'];
    if (this.consultationId) {
      this.isEditMode = true;
      // Simulation données existantes
      this.form.patchValue({
        patient: 1,
        date_consultation: '2026-05-18',
        motif: 'Fièvre persistante',
        diagnostic: 'Paludisme',
        traitement: 'Artemether 80mg',
        observations: 'Patient à revoir dans 3 jours',
      });
    }
  }
  get patient() { return this.form.get('patient'); }
  get date_consultation() { return this.form.get('date_consultation'); }
  get motif() { return this.form.get('motif'); }
  get diagnostic() { return this.form.get('diagnostic'); }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
      this.isLoading = true;
    this.errorMessage = '';

    setTimeout(() => {
      this.isLoading = false;
      this.successMessage = this.isEditMode
        ? 'Consultation modifiée avec succès !'
        : 'Consultation créée avec succès !';
      setTimeout(() => this.router.navigate(['/consultations']), 1500);
    }, 1000);
  }
}
