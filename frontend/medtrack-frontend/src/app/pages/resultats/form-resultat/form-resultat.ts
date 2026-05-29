import { ActivatedRoute, RouterLink , Router} from '@angular/router';
import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder,FormGroup, Validators } from '@angular/forms';
import { ResultatsService } from '../../../services/resultats.service';
import { ExamenService} from '../../../services/examen.service';
import { Examen } from '../../../models/examens.model';
import { Resultat } from '../../../models/resultats.model';

@Component({
  selector: 'app-form-resultat',
  standalone:true,
  imports: [CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './form-resultat.html',
  styleUrl: './form-resultat.css',
})
export class FormResultatComponent implements OnInit {
  form: FormGroup;
  isLoading=false;
  isEditMode=false;
  resultatId!: number ;
  successMessage='';
  errorMessage='';

  examens:Examen[]=[];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private resultatService: ResultatsService,
    private examenService: ExamenService,
    private cdr: ChangeDetectorRef
  ){
    this.form=this.fb.group({
      examen: ['', Validators.required],
      date_resultat:['', Validators.required],
      contenu: ['', Validators.required],
      conclusion:['', Validators.required],
      est_normal:[true, Validators.required],
    });
  }

  ngOnInit(): void {
    this.chargerExamens();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.resultatId = Number(id);
      this.isEditMode = true;
      this.chargerResultat();
    }
    const examenId = this.route.snapshot.queryParamMap.get('examen');
  if (examenId) {
    this.form.patchValue({ examen: Number(examenId) });
  }
  }
  chargerExamens(): void {
    this.examenService.getAll().subscribe({
      next: (data) => {
        this.examens = data.filter((e: any) => e.consultation.patient.est_actif === true);
        this.cdr.detectChanges();
      }
    });
  }
   chargerResultat(): void {
    this.isLoading = true;
    this.resultatService.getOne(this.resultatId).subscribe({
      next: (data) => {
        this.form.patchValue(data);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Impossible de charger le résultat.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
  get examen() { return this.form.get('examen'); }
  get date_resultat() { return this.form.get('date_resultat'); }
  get contenu() { return this.form.get('contenu'); }
  get conclusion() { return this.form.get('conclusion'); }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const data: Resultat = this.form.value;

    if (this.isEditMode) {
      this.resultatService.update(this.resultatId, data).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Résultat modifié avec succès !';
          setTimeout(() => this.router.navigate(['/resultats']), 1500);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.detail || 'Erreur lors de la modification.';
          this.cdr.detectChanges();
        }
      });
    }else{
      this.resultatService.create(data).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Résultat enregistré avec succès !';
          setTimeout(() => this.router.navigate(['/resultats']), 1500);
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
