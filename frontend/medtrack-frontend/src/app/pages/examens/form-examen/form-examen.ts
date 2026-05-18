import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-form-examen',
  standalone:true,
  imports: [CommonModule,ReactiveFormsModule, RouterLink],
  templateUrl: './form-examen.html',
  styleUrl: './form-examen.css',
})
export class FormExamenComponent implements OnInit {
  form: FormGroup;
  isLoading = false;
  isEditMode = false;
  examenId: number | null = null;
  successMessage = '';
  errorMessage = '';
   consultations = [
    { id: 1, label: 'Belmisse Temgoua — Paludisme (18/05/2026)' },
    { id: 2, label: 'Jean Kamga — Gastrite (17/05/2026)' },
    { id: 3, label: 'Marie Tchoupo — Bronchite (16/05/2026)' },
  ];

  typesExamen = [
    'BIOLOGIE', 'RADIOLOGIE', 'ECHOGRAPHIE',
    'SCANNER', 'IRM', 'ECG', 'AUTRE'
  ];
   constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
      this.form = this.fb.group({
      consultation: ['', Validators.required],
      type_examen: ['', Validators.required],
      nom_examen: ['', Validators.required],
      date_prescription: ['', Validators.required],
      date_realisation: [''],
      laboratoire: [''],
      notes: [''],
    });
  }

  ngOnInit(): void {
    this.examenId = this.route.snapshot.params['id'];
    if (this.examenId) {
      this.isEditMode = true;
      this.form.patchValue({
        consultation: 1,
        type_examen: 'BIOLOGIE',
        nom_examen: 'Numération Formule Sanguine',
        date_prescription: '2026-05-18',
        date_realisation: '2026-05-19',
        laboratoire: 'Labo Central',
        notes: 'Résultat urgent',
      });
    }
  }
  get consultation() { return this.form.get('consultation'); }
  get type_examen() { return this.form.get('type_examen'); }
  get nom_examen() { return this.form.get('nom_examen'); }
  get date_prescription() { return this.form.get('date_prescription'); }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
      this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.successMessage = this.isEditMode
        ? 'Examen modifié avec succès !'
        : 'Examen prescrit avec succès !';
      setTimeout(() => this.router.navigate(['/examens']), 1500);
    }, 1000);
  }
  
}
