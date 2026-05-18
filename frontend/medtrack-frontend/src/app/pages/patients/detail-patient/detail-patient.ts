import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';

interface Patient {
  id: number;
  nom: string;
  prenom: string;
  sexe: string;
  date_naissance: string;
  telephone: string;
  adresse: string;
  groupe_sanguin: string;
  contact_urgence_nom: string;
  contact_urgence_telephone: string;
  est_actif: boolean;
  date_enregistrement: string;
}
@Component({
  selector: 'app-detail-patient',
  standalone:true,
  imports: [CommonModule,RouterLink],
  templateUrl: './detail-patient.html',
  styleUrl: './detail-patient.css',
})
export class DetailPatientComponent implements OnInit {
  patient: Patient | null = null;
  isLoading = false;
  patientId: number | null = null;
  confirmDesactiver = false;
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}
   ngOnInit(): void {
    this.patientId = this.route.snapshot.params['id'];
    this.isLoading = true;

    // Simulation chargement données
    setTimeout(() => {
         this.patient = {
        id: this.patientId!,
        nom: 'Temgoua',
        prenom: 'Belmisse',
        sexe: 'F',
        date_naissance: '2000-01-15',
        telephone: '677000001',
        adresse: 'Yaoundé, Cameroun',
        groupe_sanguin: 'A+',
        contact_urgence_nom: 'Maffo Paul',
        contact_urgence_telephone: '699000099',
        est_actif: true,
        date_enregistrement: '2026-01-10',
      };
         this.isLoading = false;
    }, 800);
  }

  calculerAge(dateNaissance: string): number {
    const today = new Date();
    const naissance = new Date(dateNaissance);
    let age = today.getFullYear() - naissance.getFullYear();
    if (today < new Date(today.getFullYear(), naissance.getMonth(), naissance.getDate())) {
      age--;
    }
    return age;
  }

  toggleStatut(): void {
    if (!this.patient) return;

    // Simulation activation/désactivation
    this.patient.est_actif = !this.patient.est_actif;
    this.successMessage = this.patient.est_actif
      ? 'Patient activé avec succès !'
      : 'Patient désactivé avec succès !';
    this.confirmDesactiver = false;

    setTimeout(() => this.successMessage = '', 3000);
  }

}
