import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../../../services/patients.service';
import { Patients } from '../../../models/patients.model';
import { AuthRoleService } from '../../../services/auth-role.service';
@Component({
  selector: 'app-liste-patients',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './liste-patients.html',
  styleUrl: './liste-patients.css',
})
export class ListePatientsComponent implements OnInit {
  patients: Patients[] = [];
  patientsFiltres: Patients[] = [];
  recherche = '';
  isLoading = false;
  errorMessage = '';

  constructor(
    private patientService: PatientService,
    private cdr: ChangeDetectorRef,
      public roleService: AuthRoleService,

  ) {}

  ngOnInit(): void {
    this.chargerPatients();
  }

  chargerPatients(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.patientService.getPatients().subscribe({
      next: (data) => {
        this.patients = data;
        this.patientsFiltres = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Erreur lors du chargement des patients.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get totalActifs(): number {
    return this.patients.filter(p => p.est_actif).length;
  }

  get totalInactifs(): number {
    return this.patients.filter(p => !p.est_actif).length;
  }

  filtrer(): void {
    if (!this.recherche.trim()) {
      this.patientsFiltres = this.patients;
      return;
    }
    const terme = this.recherche.toLowerCase().trim();
    this.patientsFiltres = this.patients.filter(p =>
      p.nom.toLowerCase().includes(terme) ||
      p.prenom.toLowerCase().includes(terme) ||
      p.telephone.includes(terme)
    );
  }

  reinitialiser(): void {
    this.recherche = '';
    this.patientsFiltres = this.patients;
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
}