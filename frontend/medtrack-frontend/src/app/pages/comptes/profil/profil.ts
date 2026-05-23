import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profil.html',
  styleUrl: './profil.css'
})
export class ProfilComponent implements OnInit {

  profil: any = null;
  isLoading = false;
  errorMessage = '';

  mdpForm: FormGroup;
  isLoadingMdp = false;
  successMdp = '';
  errorMdp = '';
  showAncien = false;
  showNouveau = false;
  showConfirmer = false;
  showMdpForm = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.mdpForm = this.fb.group({
      ancien_mot_de_passe: ['', Validators.required],
      nouveau_mot_de_passe: ['', [Validators.required, Validators.minLength(8)]],
      confirmer_mot_de_passe: ['', Validators.required],
    }, { validators: this.passwordsMatch });
  }

  ngOnInit(): void {
    this.chargerProfil();
  }

  chargerProfil(): void {
    this.isLoading = true;
    this.http.get(`${environment.apiUrl}/comptes/mon-profil/`).subscribe({
      next: (data: any) => {
        this.profil = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        // Si admin (pas de profil), on affiche quand même les infos de base
        if (err.status === 404) {
          this.profil = {
            nom_complet: 'Administrateur',
            username: 'admin',
            email: 'admin@medtrack.com',
            role: 'ADMIN',
            telephone: '',
            specialite: '',
            premiere_connexion: false,
          };
        } else {
          this.errorMessage = 'Impossible de charger le profil.';
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  passwordsMatch(form: FormGroup) {
    const nouveau = form.get('nouveau_mot_de_passe')?.value;
    const confirmer = form.get('confirmer_mot_de_passe')?.value;
    if (nouveau && confirmer && nouveau !== confirmer) {
      form.get('confirmer_mot_de_passe')?.setErrors({ notMatch: true });
    }
    return null;
  }

  get ancien() { return this.mdpForm.get('ancien_mot_de_passe'); }
  get nouveau() { return this.mdpForm.get('nouveau_mot_de_passe'); }
  get confirmer() { return this.mdpForm.get('confirmer_mot_de_passe'); }

  getRoleLabel(): string {
    const labels: any = { 'MEDECIN': 'Médecin', 'INFIRMIER': 'Infirmier', 'ADMIN': 'Administrateur' };
    return labels[this.profil?.role] || this.profil?.role;
  }

  getRoleIcon(): string {
    const icons: any = { 'MEDECIN': 'bi-person-badge-fill', 'INFIRMIER': 'bi-heart-pulse-fill', 'ADMIN': 'bi-shield-fill' };
    return icons[this.profil?.role] || 'bi-person-fill';
  }

  getRoleCouleur(): string {
    const couleurs: any = { 'MEDECIN': 'primary', 'INFIRMIER': 'success', 'ADMIN': 'danger' };
    return couleurs[this.profil?.role] || 'secondary';
  }

  onSubmitMdp(): void {
    if (this.mdpForm.invalid) {
      this.mdpForm.markAllAsTouched();
      return;
    }
    this.isLoadingMdp = true;
    this.errorMdp = '';

    this.http.post(`${environment.apiUrl}/comptes/changer-mot-de-passe/`, this.mdpForm.value).subscribe({
      next: () => {
        this.isLoadingMdp = false;
        this.successMdp = 'Mot de passe changé avec succès !';
        this.mdpForm.reset();
        this.showMdpForm = false;
        this.cdr.detectChanges();
        setTimeout(() => { this.successMdp = ''; this.cdr.detectChanges(); }, 4000);
      },
      error: (err) => {
        this.isLoadingMdp = false;
        if (err.error?.ancien_mot_de_passe) {
          this.errorMdp = err.error.ancien_mot_de_passe;
        } else {
          this.errorMdp = 'Erreur lors du changement de mot de passe.';
        }
        this.cdr.detectChanges();
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}