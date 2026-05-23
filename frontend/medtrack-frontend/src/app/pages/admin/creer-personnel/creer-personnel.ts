import { Component , ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-creer-personnel',
  standalone:true,
  imports: [CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './creer-personnel.html',
  styleUrl: './creer-personnel.css',
})
export class CreerPersonnelComponent {
form: FormGroup;
isLoading=false;
successMessage='';
errorMessage='';

constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      telephone: [''],
      specialite: [''],
    });
  }

  get first_name() { return this.form.get('first_name'); }
  get last_name() { return this.form.get('last_name'); }
  get email() { return this.form.get('email'); }
  get role() { return this.form.get('role'); }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';

    this.http.post(`${environment.apiUrl}/comptes/creer/`, this.form.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Compte créé avec succès ! Un email avec les identifiants a été envoyé.';
        this.form.reset();
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate(['/admin/personnel']), 3000);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.error?.email) {
          this.errorMessage = err.error.email[0];
        } else {
          this.errorMessage = err.error?.detail || 'Erreur lors de la création du compte.';
        }
        this.cdr.detectChanges();
      }
    });
  }
}
