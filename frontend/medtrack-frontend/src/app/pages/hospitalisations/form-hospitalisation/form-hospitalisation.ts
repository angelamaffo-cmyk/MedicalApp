import { ActivatedRoute, Router,RouterLink } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule,FormBuilder,FormGroup,Validators } from '@angular/forms';


@Component({
  selector: 'app-form-hospitalisation',
  standalone:true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './form-hospitalisation.html',
  styleUrl: './form-hospitalisation.css',
})
export class FormHospitalisationComponent implements OnInit{
  form: FormGroup;
  isLoading = false;
  isEditMode = false;
  hospitalisationId: number | null = null;
  successMessage = '';
  errorMessage = '';

  patients = [
    { id: 1, nom: 'Angela Maffo' },
    { id: 2, nom: 'Jean Kamga' },
    { id: 3, nom: 'Marie Tchoupo' },
  ];

   services = [
    { id: 1, nom: 'Médecine Interne' },
    { id: 2, nom: 'Chirurgie' },
    { id: 3, nom: 'Pédiatrie' },
    { id: 4, nom: 'Urgences' },
    { id: 5, nom: 'Maternité' },
  ];
    lits = [
    { id: 1, nom: 'Lit 01' },
    { id: 2, nom: 'Lit 02' },
    { id: 3, nom: 'Lit 03' },
    { id: 4, nom: 'Lit 04' },
    { id: 5, nom: 'Lit 05' },
  ];
  statuts = [
    { value: 'EN_COURS', label: 'En cours' },
    { value: 'SORTI', label: 'Sorti' },
    { value: 'TRANSFERE', label: 'Transféré' },
    { value: 'DECEDE', label: 'Décédé' },
  ];

    constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
     this.form = this.fb.group({
      patient: ['', Validators.required],
      lit: ['', Validators.required],
      date_entree: ['', Validators.required],
      date_sortie: [''],
      motif_admission: ['', Validators.required],
      statut: ['EN_COURS', Validators.required],
      motif_sortie: [''],
    });
      }

  ngOnInit(): void {
    this.hospitalisationId = this.route.snapshot.params['id'];
    if (this.hospitalisationId) {
      this.isEditMode = true;
      this.form.patchValue({
        patient: 1,
        lit: 1,
        date_entree: '2026-05-15',
        motif_admission: 'Paludisme grave',
        statut: 'EN_COURS',
      });
    }
  }
   get patient() { return this.form.get('patient'); }
  get lit() { return this.form.get('lit'); }
  get date_entree() { return this.form.get('date_entree'); }
  get motif_admission() { return this.form.get('motif_admission'); }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
      this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.successMessage = this.isEditMode
        ? 'Hospitalisation modifiée avec succès !'
        : 'Patient admis avec succès !';
      setTimeout(() => this.router.navigate(['/hospitalisations']), 1500);
    }, 1000);
  }
}
