import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { AssignationService } from '../../../services/assignation.service';

@Component({
  selector: 'app-form-soin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './form-soin.html',
  styleUrls: ['./form-soin.css']
})
export class FormSoinComponent implements OnInit {
  form: FormGroup;
  assignationId!: number;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private assignationService: AssignationService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      description: ['', Validators.required],
      observations: [''],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.queryParamMap.get('assignation');
    if (id) this.assignationId = Number(id);
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.isLoading = true;
    this.assignationService.creerSoin({
      assignation: this.assignationId,
      ...this.form.value
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Soin enregistré avec succès !';
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate(['/soins']), 1500);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.detail || 'Erreur lors de l\'enregistrement.';
        this.cdr.detectChanges();
      }
    });
  }
}