import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Hospitalisation{
  id: number;
  patient_nom: string;
  patient_prenom: string;
  service: string;
  lit: string;
  medecin: string;
  date_entree: string;
  date_sortie: string | null;
  motif_admission: string;
  motif_sortie: string;
  statut: string;
  observations: { id: number; auteur: string; contenu: string; date: string }[];
}
@Component({
  selector: 'app-detail-hospitalisation',
  standalone:true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './detail-hospitalisation.html',
  styleUrl: './detail-hospitalisation.css',
})
export class DetailHospitalisationComponent implements OnInit {
  hospitalisation: Hospitalisation | null = null;
  isLoading = false;
  hospitalisationId: number | null = null;
  successMessage = '';
  showObservationForm = false;
  observationForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.observationForm = this.fb.group({
      contenu: ['', Validators.required]
    });
  }
   ngOnInit(): void {
    this.hospitalisationId = this.route.snapshot.params['id'];
    this.isLoading = true;
    setTimeout(() => {
       this.hospitalisation = {
        id: this.hospitalisationId!,
        patient_nom: 'Maffo',
        patient_prenom: 'Angela',
        service: 'Médecine Interne',
        lit: 'Lit 05',
        medecin: 'Dr Kamga',
        date_entree: '2026-05-15T08:30',
        date_sortie: null,
        motif_admission: 'Paludisme grave avec complications neurologiques',
        motif_sortie: '',
        statut: 'EN_COURS',
          observations: [
          { id: 1, auteur: 'Dr Kamga', contenu: 'Patient stable. Température : 38.5°C. Traitement en cours.', date: '2026-05-15T10:00' },
          { id: 2, auteur: 'Inf. Biya', contenu: 'Prise de médicaments effectuée. Patient coopératif.', date: '2026-05-16T08:00' },
        ]
      };
      this.isLoading=false;
    }, 800);
  }
  getStatutLabel(statut: string): string {
    const labels: any = { 'EN_COURS': 'En cours', 'SORTI': 'Sorti', 'TRANSFERE': 'Transféré', 'DECEDE': 'Décédé' };
    return labels[statut] || statut;
  }
  getStatutClass(statut: string): string {
    const classes: any = { 'EN_COURS': 'warning', 'SORTI': 'success', 'TRANSFERE': 'info', 'DECEDE': 'danger' };
    return classes[statut] || 'secondary';
  }

  ajouterObservation(): void {
    if (this.observationForm.invalid) return;
    this.hospitalisation?.observations.unshift({
      id: Date.now(),
      auteur: 'Utilisateur connecté',
      contenu: this.observationForm.value.contenu,
      date: new Date().toISOString()
    });
      this.observationForm.reset();
    this.showObservationForm = false;
    this.successMessage = 'Observation ajoutée avec succès !';
    setTimeout(() => this.successMessage = '', 3000);
  }

}
