import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AssignationService } from '../../../services/assignation.service';

@Component({
  selector: 'app-assigner-medecin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './assigner-medecin.html',
  styleUrls: ['./assigner-medecin.css']
})
export class AssignerMedecinComponent implements OnInit {
  form: FormGroup;
  patientId!: number;
  medecins: any[] = [];
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  services = [
    'Cardiologie', 'Neurologie', 'Pédiatrie', 'Chirurgie',
    'Gynécologie', 'Dermatologie', 'Ophtalmologie', 'Autre'
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private assignationService: AssignationService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      medecin_cible: ['', Validators.required],
      motif: ['', Validators.required],
      service: [''],
    });
  }

  ngOnInit(): void {
    this.patientId = Number(this.route.snapshot.paramMap.get('id'));
    this.chargerMedecins();
  }

  chargerMedecins(): void {
  this.http.get<any[]>(`${environment.apiUrl}/comptes/personnel-medical/`).subscribe({
    next: (data) => {
      this.medecins = data.filter(p =>
        p.role === 'MEDECIN' &&
        p.specialite !== 'Médecine Générale' &&
        p.est_actif
      );
      this.cdr.detectChanges();
    },
    error: (err) => console.error('Erreur:', err)
  });
}

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.isLoading = true;
    this.assignationService.creerAssignationMedecin({
      patient: this.patientId,
      ...this.form.value
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Patient assigné au médecin spécialiste avec succès !';
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate(['/patients', this.patientId]), 1500);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.detail || 'Erreur lors de l\'assignation.';
        this.cdr.detectChanges();
      }
    });
  }
}