import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AssignationService } from '../../../services/assignation.service';

@Component({
  selector: 'app-assigner-infirmier',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './assigner-infirmier.html',
  styleUrls: ['./assigner-infirmier.css']
})
export class AssignerInfirmierComponent implements OnInit {
  form: FormGroup;
  patientId!: number;
  infirmiers: any[] = [];
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private assignationService: AssignationService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      infirmier: ['', Validators.required],
      soins_a_faire: ['', Validators.required],
      date_debut: ['', Validators.required],
      date_fin: [''],
    });
  }

  ngOnInit(): void {
    this.patientId = Number(this.route.snapshot.paramMap.get('id'));
    this.chargerInfirmiers();
  }

  chargerInfirmiers(): void {
  this.http.get<any[]>(`${environment.apiUrl}/comptes/personnel-medical/`).subscribe({
    next: (data) => {
      this.infirmiers = data.filter(p =>
        p.role === 'INFIRMIER' && p.est_actif
      );
      this.cdr.detectChanges();
    },
    error: (err) => console.error('Erreur:', err)
  });
}

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.isLoading = true;
    this.assignationService.creerAssignationInfirmier({
      patient: this.patientId,
      ...this.form.value
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Patient assigné à l\'infirmier avec succès !';
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