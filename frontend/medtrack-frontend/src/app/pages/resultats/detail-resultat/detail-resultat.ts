import { Component, OnInit , ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ResultatsService } from '../../../services/resultats.service';
import { Resultat } from '../../../models/resultats.model';



@Component({
  selector: 'app-detail-resultat',
  standalone:true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detail-resultat.html',
  styleUrl: './detail-resultat.css',
})
export class DetailResultatComponent implements OnInit {
  resultat: Resultat | null = null;
  isLoading = false;
  resultatId!: number ;
  confirmToggle = false;
  successMessage = '';
  errorMessage = '';
  constructor(private route: ActivatedRoute,
      private resultatService: ResultatsService,
    private cdr: ChangeDetectorRef
  ){}

 ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.resultatId = Number(id);
      this.chargerResultat();
    }
  }
  chargerResultat(): void {
    this.isLoading = true;
    this.resultatService.getOne(this.resultatId).subscribe({
      next: (data) => {
        this.resultat = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Impossible de charger le résultat.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
   
 
    

}
