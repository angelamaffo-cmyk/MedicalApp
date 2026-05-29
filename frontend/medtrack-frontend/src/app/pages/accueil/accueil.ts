import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css',
})
export class AccueilComponent {
constructor(private router: Router) {}

  allerLogin(): void {
    this.router.navigate(['/login']);
  }
  scrollToFeatures(): void {
  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
}
}
