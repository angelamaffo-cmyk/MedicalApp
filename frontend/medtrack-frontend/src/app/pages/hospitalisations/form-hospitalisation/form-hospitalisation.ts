import { ActivatedRoute, Router,RouterLink } from '@angular/router';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule,FormBuilder,FormGroup,Validators } from '@angular/forms';
import { HospitalisationsService } from '../../../services/hospitalisations.service';
import { PatientService } from '../../../services/patients.service';
import { Patients } from '../../../models/patients.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Hospitalisation } from '../../../models/hospitalisations.model';
import { Lit } from '../../../models/hospitalisations.model';

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
  hospitalisationId!: number ;
  successMessage = '';
  errorMessage = '';

  patients : Patients[]= [];
   lits: Lit[] = [];
  

  
  
  statuts = [
    { value: 'EN_COURS', label: 'En cours' },
    { value: 'SORTI', label: 'Sorti' },
    { value: 'TRANSFERE', label: 'Transféré' },
    { value: 'DECEDE', label: 'Décédé' },
  ];

    constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private hospitalisationService: HospitalisationsService,
    private patientService: PatientService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
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
   this.chargerPatients();
    this.chargerLits();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.hospitalisationId = Number(id);
      this.isEditMode = true;
      this.chargerHospitalisation();
    }
  }
  chargerPatients(): void {
    this.patientService.getPatients().subscribe({
      next: (data) => { this.patients = data; this.cdr.detectChanges(); }
    });
  }
  chargerLits(): void {
    this.http.get<Lit[]>(`${environment.apiUrl}/lits/`).subscribe({
      next: (data) => {
        this.lits = data.filter(l => l.statut === 'DISPONIBLE');
        this.cdr.detectChanges();
      }
    });
  }
   chargerHospitalisation(): void {
    this.isLoading = true;
    this.hospitalisationService.getOne(this.hospitalisationId).subscribe({
      next: (data) => {
        this.form.patchValue(data);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Impossible de charger l\'hospitalisation.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
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
      const data: Hospitalisation = this.form.value;

    if (this.isEditMode) {
      this.hospitalisationService.update(this.hospitalisationId, data).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Hospitalisation modifiée avec succès !';
          setTimeout(() => this.router.navigate(['/hospitalisations']), 1500);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.detail || 'Erreur lors de la modification.';
          this.cdr.detectChanges();
        }
      });
    } else {
      this.hospitalisationService.create(data).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Patient admis avec succès !';
          setTimeout(() => this.router.navigate(['/hospitalisations']), 1500);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.detail || 'Erreur lors de la création.';
          this.cdr.detectChanges();
        }
      });
    }
  }
}
