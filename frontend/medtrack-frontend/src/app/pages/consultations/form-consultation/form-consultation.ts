import { Patients } from './../../../models/patients.model';
import { Component, OnInit , ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { PatientService } from '../../../services/patients.service';
import { Consultation } from '../../../models/consultations.model';
import { ConsultationService } from '../../../services/consultation.service';
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
  consultationId!: number ;
  successMessage = '';
  errorMessage = '';

  // Simulation liste patients
  patients : Patients[]=[];
   
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private consultationService: ConsultationService,
    private patientService: PatientService,
    private cdr: ChangeDetectorRef
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
    this.chargerPatients();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.consultationId = Number(id);
      this.isEditMode = true;
      this.chargerConsultation();
      
    }
  }

  chargerPatients(): void {
    this.patientService.getPatients().subscribe({
      next: (data) => {
        this.patients = data;
        this.cdr.detectChanges();
      }
    });
  }
  chargerConsultation(): void {
    this.isLoading = true;
    this.consultationService.getOne(this.consultationId).subscribe({
      next: (data) => {
        this.form.patchValue(data);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: ()=>{
        this.errorMessage='Impossible de charger la consultation';
        this.isLoading=false;
        this.cdr.detectChanges();
      }
    });
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
      const data: Consultation = this.form.value;

    if (this.isEditMode) {
      this.consultationService.update(this.consultationId, data).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Consultation modifiée avec succès !';
          setTimeout(() => this.router.navigate(['/consultations']), 1500);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.detail || 'Erreur lors de la modification.';
          this.cdr.detectChanges();
        }
      });
      } else {
      this.consultationService.create(data).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Consultation créée avec succès !';
          setTimeout(() => this.router.navigate(['/consultations']), 1500);
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
