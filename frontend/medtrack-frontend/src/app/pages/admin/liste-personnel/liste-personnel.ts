import { Component , OnInit, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-liste-personnel',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './liste-personnel.html',
  styleUrl: './liste-personnel.css',
})
export class ListePersonnelComponent implements OnInit{

  personnel:any[]=[];
  personnelFiltres:any[]=[];
  recherche='';
  isLoading=false;
  errorMessage='';
  successMessage='';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ){}

  ngOnInit(): void {
    this.chargerPersonnel();
  }
  chargerPersonnel(): void {
    this.isLoading = true;
    this.http.get<any[]>(`${environment.apiUrl}/comptes/personnel/`).subscribe({
      next: (data) => {
        this.personnel = data;
        this.personnelFiltres = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement du personnel.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get totalMedecins(): number { return this.personnel.filter(p => p.role === 'MEDECIN').length; }
  get totalInfirmiers(): number { return this.personnel.filter(p => p.role === 'INFIRMIER').length; }
  get totalActifs(): number { return this.personnel.filter(p => p.est_actif).length; }

  filtrer(): void {
    if (!this.recherche.trim()) {
      this.personnelFiltres = this.personnel;
      return;
    }
    const terme = this.recherche.toLowerCase().trim();
    this.personnelFiltres = this.personnel.filter(p =>
      p.nom_complet?.toLowerCase().includes(terme) ||
      p.email?.toLowerCase().includes(terme) ||
      p.role?.toLowerCase().includes(terme)
    );
  }
  toggleStatut(p: any): void {
    this.http.post(`${environment.apiUrl}/comptes/desactiver/${p.utilisateur_id || p.id}/`, {}).subscribe({
      next: () => {
        p.est_actif = !p.est_actif;
        this.successMessage = p.est_actif ? 'Compte activé !' : 'Compte désactivé !';
        this.cdr.detectChanges();
        setTimeout(() => { this.successMessage = ''; this.cdr.detectChanges(); }, 3000);
      },
      error: () => {
        this.errorMessage = 'Erreur lors du changement de statut.';
        this.cdr.detectChanges();
      }
    });
  }

  getRoleCouleur(role: string): string {
    return role === 'MEDECIN' ? 'primary' : 'success';
  }
}
