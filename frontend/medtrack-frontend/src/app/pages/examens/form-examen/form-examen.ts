import { Component, OnInit , ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Examen } from '../../../models/examens.model';
import { ExamenService } from '../../../services/examen.service';
import { Consultation } from '../../../models/consultations.model';
import { ConsultationService } from '../../../services/consultation.service';
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
  examenId!: number ;
  successMessage = '';
  errorMessage = '';
   consultations : Consultation[]= [];
   

  typesExamen = [
    'BIOLOGIE', 'RADIOLOGIE', 'ECHOGRAPHIE',
    'SCANNER', 'IRM', 'ECG', 'AUTRE'
  ];
  laboratoires = [
  'Laboratoire Central',
  'Laboratoire Saint Jean',
  'Laboratoire Pasteur',
  'Service de Radiologie',
  'Service d\'Imagerie Médicale',
  'Service d\'Échographie',
  'Cabinet d\'Analyses',
  'Autre',
];
   constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private examenService: ExamenService,
    private consultationService: ConsultationService,
    private cdr: ChangeDetectorRef
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
    this.chargerConsultations();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.examenId = Number(id);
      this.isEditMode = true;
      this.chargerExamen();
    }
  }
  chargerConsultations(): void {
    this.consultationService.getAll().subscribe({
      next: (data) => {
        this.consultations = data.filter((c: any) => c.patient && c.patient.est_actif === true); 
        this.cdr.detectChanges();
      }
    });
  }
  chargerExamen(): void {
    this.isLoading = true;
    this.examenService.getOne(this.examenId).subscribe({
      next: (data) => {
        this.form.patchValue(data);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Impossible de charger l\'examen.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
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
      const data: Examen = this.form.value;
    if (this.isEditMode) {
      this.examenService.update(this.examenId, data).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Examen modifié avec succès !';
          setTimeout(() => this.router.navigate(['/examens']), 1500);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.detail || 'Erreur lors de la modification.';
          this.cdr.detectChanges();
        }
      });
      } else {
      this.examenService.create(data).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Examen prescrit avec succès !';
          setTimeout(() => this.router.navigate(['/examens']), 1500);
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
