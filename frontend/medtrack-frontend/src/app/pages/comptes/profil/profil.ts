import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule,FormBuilder,FormGroup,Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profil',
  standalone:true,
  imports: [CommonModule,ReactiveFormsModule, RouterLink],
  templateUrl: './profil.html',
  styleUrl: './profil.css',
})
export class ProfilComponent {
//simulation

  profil = {
    nom_complet: 'Angela Maffo Temgoua',
    username: 'angela.maffo',
    email: 'angela.maffo@medtrack.com',
    role: 'MEDECIN',
    telephone: '677000001',
    specialite: 'Médecine Générale',
    premiere_connexion: false,
    date_creation: '2026-01-10',
  };

   // Formulaire changement mot de passe
  mdpForm: FormGroup;
  isLoadingMdp = false;
  successMdp = '';
  errorMdp = '';
  showAncien = false;
  showNouveau = false;
  showConfirmer = false;
  showMdpForm = false;
   constructor(private fb: FormBuilder) {
    this.mdpForm = this.fb.group({
      ancien_mot_de_passe: ['', Validators.required],
      nouveau_mot_de_passe: ['', [Validators.required, Validators.minLength(8)]],
      confirmer_mot_de_passe: ['', Validators.required],
    }, { validators: this.passwordsMatch });
  }

  ngOnInit(): void {}

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
    return this.profil.role === 'MEDECIN' ? 'Médecin' : 'Infirmier';
  }

  getRoleIcon(): string {
    return this.profil.role === 'MEDECIN' ? 'bi-person-badge-fill' : 'bi-heart-pulse-fill';
  }
  onSubmitMdp(): void {
    if (this.mdpForm.invalid) {
      this.mdpForm.markAllAsTouched();
      return;
    }
    this.isLoadingMdp = true;
    this.errorMdp = '';

    // Simulation
    setTimeout(() => {
      this.isLoadingMdp = false;
      this.successMdp = 'Mot de passe changé avec succès !';
      this.mdpForm.reset();
      this.showMdpForm = false;
      setTimeout(() => this.successMdp = '', 4000);
    }, 1000);
  }
  
}
