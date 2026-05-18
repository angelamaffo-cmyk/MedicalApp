import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Patient {
  id: number;
  nom: string;
  prenom: string;
  sexe: string;
  date_naissance: string;
  telephone: string;
  groupe_sanguin: string;
  est_actif: boolean;
}
@Component({
  selector: 'app-liste-patients',
  standalone:true,
  imports: [CommonModule, RouterLink, FormsModule
  ],
  templateUrl: './liste-patients.html',
  styleUrl: './liste-patients.css',
})
export class ListePatientsComponent implements OnInit{
 patients: Patient[] = [
    { id: 1, nom: 'Temgoua', prenom: 'Belmisse', sexe: 'F', date_naissance: '2000-01-15', telephone: '677000001', groupe_sanguin: 'A+', est_actif: true },
    { id: 2, nom: 'Kamga', prenom: 'Jean', sexe: 'M', date_naissance: '1985-06-20', telephone: '699000002', groupe_sanguin: 'O+', est_actif: true },
    { id: 3, nom: 'Tchoupo', prenom: 'Marie', sexe: 'F', date_naissance: '1990-03-10', telephone: '655000003', groupe_sanguin: 'B+', est_actif: false },
  ];
   patientsFiltres: Patient[] = [];
  recherche = '';
  isLoading = false;

  ngOnInit(): void {
    this.patientsFiltres = this.patients;
  }

  filtrer(): void {
    const terme = this.recherche.toLowerCase();
    this.patientsFiltres = this.patients.filter(p =>
      p.nom.toLowerCase().includes(terme) ||
      p.prenom.toLowerCase().includes(terme) ||
      p.telephone.includes(terme)
    );
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
