import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-changer-mot-de-passe',
    standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './changer-mot-de-passe.html',
  styleUrl: './changer-mot-de-passe.css',
})
export class ChangerMotDePasseComponent {
 form: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  showAncien = false;
  showNouveau = false;
  showConfirmer = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.form = this.fb.group({
      ancien_mot_de_passe: ['', [Validators.required]],
      nouveau_mot_de_passe: ['', [Validators.required, Validators.minLength(8)]],
      confirmer_mot_de_passe: ['', [Validators.required]]
    }, { validators: this.passwordsMatchValidator });
  }

  passwordsMatchValidator(form: FormGroup) {
    const nouveau = form.get('nouveau_mot_de_passe')?.value;
    const confirmer = form.get('confirmer_mot_de_passe')?.value;
    if (nouveau && confirmer && nouveau !== confirmer) {
      form.get('confirmer_mot_de_passe')?.setErrors({ notMatch: true });
    }
    return null;
  }

  get ancien() { return this.form.get('ancien_mot_de_passe'); }
  get nouveau() { return this.form.get('nouveau_mot_de_passe'); }
  get confirmer() { return this.form.get('confirmer_mot_de_passe'); }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.http.post(`${environment.apiUrl}/comptes/changer-mot-de-passe/`, this.form.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Mot de passe changé avec succès !';
        setTimeout(() => this.router.navigate(['/dashboard']), 2000);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.error?.ancien_mot_de_passe) {
          this.errorMessage = err.error.ancien_mot_de_passe;
        } else {
          this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
        }
      }
    });
  }

  passer(): void {
    this.router.navigate(['/dashboard']);
  }
}
