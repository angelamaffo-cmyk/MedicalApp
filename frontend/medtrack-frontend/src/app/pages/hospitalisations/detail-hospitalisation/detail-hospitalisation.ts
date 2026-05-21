import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HospitalisationsService } from '../../../services/hospitalisations.service';
import { Hospitalisation,Observation } from '../../../models/hospitalisations.model';

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
  hospitalisationId!: number ;
  successMessage = '';
  errorMessage = '';
  showObservationForm = false;
  observationForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private hospitalisationService: HospitalisationsService,
    private cdr: ChangeDetectorRef,

    private fb: FormBuilder
  ) {
    this.observationForm = this.fb.group({
      contenu: ['', Validators.required]
    });
  }
   ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.hospitalisationId = Number(id);
      this.chargerHospitalisation();
    }
        
  }
  chargerHospitalisation(): void {
    this.isLoading = true;
    this.hospitalisationService.getOne(this.hospitalisationId).subscribe({
      next: (data) => {
        this.hospitalisation = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Impossible de charger l\'hospitalisation.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
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
    if (this.observationForm.invalid || !this.hospitalisation) return;

    const obs: Observation = {
      hospitalisation: this.hospitalisationId,
      contenu: this.observationForm.value.contenu
    };
    this.hospitalisationService.ajouterObservation(obs).subscribe({
      next: (data) => {
        if (!this.hospitalisation!.observations) {
          this.hospitalisation!.observations = [];
        }
        this.hospitalisation!.observations.unshift(data);
        this.observationForm.reset();
        this.showObservationForm = false;
        this.successMessage = 'Observation ajoutée avec succès !';
        this.cdr.detectChanges();
        setTimeout(() => { this.successMessage = ''; this.cdr.detectChanges(); }, 3000);
      },
      error: () => {
        this.errorMessage = 'Erreur lors de l\'ajout de l\'observation.';
        this.cdr.detectChanges();
      }
    });
  }

}
