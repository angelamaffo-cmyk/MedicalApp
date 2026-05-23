import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AssignationService } from '../../../services/assignation.service';
import { AuthRoleService } from '../../../services/auth-role.service';
import { AssignationInfirmier } from '../../../models/assignation.model';

@Component({
  selector: 'app-liste-soins',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './liste-soins.html',
  styleUrls: ['./liste-soins.css']
})
export class ListeSoinsComponent implements OnInit {
  assignations: AssignationInfirmier[] = [];
  assignationsFiltrees: AssignationInfirmier[] = [];
  recherche = '';
  isLoading = false;
  errorMessage = '';

  constructor(
    private assignationService: AssignationService,
    public roleService: AuthRoleService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerAssignations();
  }

  chargerAssignations(): void {
    this.isLoading = true;
    this.assignationService.getAssignationsInfirmier().subscribe({
      next: (data) => {
        this.assignations = data;
        this.assignationsFiltrees = data;
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

  get total(): number { return this.assignations.length; }
  get actives(): number { return this.assignations.filter(a => a.est_active).length; }

  filtrer(): void {
    if (!this.recherche.trim()) {
      this.assignationsFiltrees = this.assignations;
      return;
    }
    const terme = this.recherche.toLowerCase();
    this.assignationsFiltrees = this.assignations.filter(a =>
      a.patient_nom?.toLowerCase().includes(terme) ||
      a.patient_prenom?.toLowerCase().includes(terme) ||
      a.soins_a_faire.toLowerCase().includes(terme)
    );
  }
}