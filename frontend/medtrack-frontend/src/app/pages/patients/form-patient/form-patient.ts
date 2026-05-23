import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { PatientService } from '../../../services/patients.service';
import { Patients } from '../../../models/patients.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AuthRoleService } from '../../../services/auth-role.service';

@Component({
  selector: 'app-form-patient',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
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
  medecins: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private patientService: PatientService,
    private http: HttpClient,
    public roleService: AuthRoleService,
    private cdr: ChangeDetectorRef
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
      medecin_responsable: [''],
    });
  }

  ngOnInit(): void {
    // Charger la liste des médecins si infirmier
    if (this.roleService.isInfirmier()) {
      this.chargerMedecins();
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.patientId = Number(id);
      this.isEditMode = true;
      this.chargerPatient();
    }
  }

 chargerMedecins(): void {
  this.http.get<any[]>(`${environment.apiUrl}/comptes/personnel-medical/`).subscribe({
    next: (data) => {
      this.medecins = data.filter((p: any) => p.role === 'MEDECIN');
      this.cdr.detectChanges();
    }
  });
}

  chargerPatient(): void {
    this.isLoading = true;
    this.patientService.getPatient(this.patientId).subscribe({
      next: (patient) => {
        this.form.patchValue(patient);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Impossible de charger le patient';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
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

    const data: any = { ...this.form.value };

    // Si médecin responsable non sélectionné, on l'enlève
    if (!data.medecin_responsable) {
      delete data.medecin_responsable;
    }

    if (this.isEditMode) {
      this.patientService.updatePatient(this.patientId, data).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/patients']);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.detail || 'Erreur lors de la modification.';
          this.cdr.detectChanges();
        }
      });
    } else {
      this.patientService.createPatient(data).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/patients']);
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