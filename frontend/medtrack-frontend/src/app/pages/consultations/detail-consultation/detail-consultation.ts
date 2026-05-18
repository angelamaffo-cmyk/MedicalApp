import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';

interface Consultation {
  id: number;
  patient_nom: string;
  patient_prenom: string;
  date_consultation: string;
  motif: string;
  diagnostic: string;
  traitement: string;
  observations: string;
  est_actif: boolean;
  date_creation: string;
}
@Component({
  selector: 'app-detail-consultation',
  standalone:true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detail-consultation.html',
  styleUrl: './detail-consultation.css',
})
export class DetailConsultationComponent {
  consultation: Consultation | null = null;
  isLoading = false;
  consultationId: number | null = null;
  confirmToggle = false;
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.consultationId = this.route.snapshot.params['id'];
    this.isLoading = true;

    setTimeout(() => {
      this.consultation = {
        id: this.consultationId!,
        patient_nom: 'Temgoua',
        patient_prenom: 'Belmisse',
        date_consultation: '2026-05-18',
        motif: 'Fièvre persistante depuis 3 jours',
        diagnostic: 'Paludisme simple',
        traitement: 'Artemether 80mg — 3 fois par jour pendant 5 jours',
        observations: 'Patient à revoir dans 3 jours. Éviter l\'automédication.',
        est_actif: true,
        date_creation: '2026-05-18',
      };
       this.isLoading = false;
    }, 800);
  }

  toggleStatut(): void {
    if (!this.consultation) return;
    this.consultation.est_actif = !this.consultation.est_actif;
    this.successMessage = this.consultation.est_actif
      ? 'Consultation activée avec succès !'
      : 'Consultation désactivée avec succès !';
    this.confirmToggle = false;
    setTimeout(() => this.successMessage = '', 3000);
  }
}
