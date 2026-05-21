import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HospitalisationsService } from '../../../services/hospitalisations.service';
import { Hospitalisation } from '../../../models/hospitalisations.model';


@Component({
  selector: 'app-liste-hospitalisations',
  standalone:true,
  imports: [CommonModule, RouterLink,FormsModule],
  templateUrl: './liste-hospitalisations.html',
  styleUrl: './liste-hospitalisations.css',
})
export class ListeHospitalisationsComponent implements OnInit{
 hospitalisations: Hospitalisation[] = [];

   hospitalisationsFiltrees: Hospitalisation[] = [];
  recherche = '';
  isLoading = false;
  errorMessage = '';

   constructor(
    private hospitalisationService: HospitalisationsService,
    private cdr: ChangeDetectorRef
  ) {}

   

  ngOnInit(): void {
this.chargerHospitalisations();  
}
chargerHospitalisations(): void {
    this.isLoading = true;
    this.hospitalisationService.getAll().subscribe({
      next: (data) => {
        this.hospitalisations = data;
        this.hospitalisationsFiltrees = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
  get total(): number { return this.hospitalisations.length; }
  get enCours(): number { return this.hospitalisations.filter(h => h.statut === 'EN_COURS').length; }
  get sortis(): number { return this.hospitalisations.filter(h => h.statut === 'SORTI').length; }

    filtrer(): void {
    if(!this.recherche.trim()){
      this.hospitalisationsFiltrees=this.hospitalisations;
      return;
    }
    const terme = this.recherche.toLowerCase().trim();
    this.hospitalisationsFiltrees = this.hospitalisations.filter(h =>
      h.patient_nom?.toLowerCase().includes(terme) ||
      h.patient_prenom?.toLowerCase().includes(terme) ||
      h.service_nom?.toLowerCase().includes(terme) ||
      h.statut.toLowerCase().includes(terme)
    );
  }
  reinitialiser(): void {
    this.recherche = '';
    this.hospitalisationsFiltrees = this.hospitalisations;
  }

  getStatutColor(statut: string): string {
    const colors: any = { 'EN_COURS': 'warning', 'SORTI': 'success', 'TRANSFERE': 'info', 'DECEDE': 'danger' };
    return colors[statut] || 'secondary';
  }

  getStatutLabel(statut: string): string {
    const labels: any = { 'EN_COURS': 'En cours', 'SORTI': 'Sorti', 'TRANSFERE': 'Transféré', 'DECEDE': 'Décédé' };
    return labels[statut] || statut;
  }
}
