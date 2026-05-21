import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent {
  @Input() isOpen = true;

  constructor(public authService: AuthService) {}

  menuItems = [
    { label: 'Dashboard', icon: 'bi-speedometer2', route: '/dashboard' },
    { label: 'Patients', icon: 'bi-people-fill', route: '/patients' },
    { label: 'Consultations', icon: 'bi-clipboard2-pulse-fill', route: '/consultations' },
    { label: 'Examens', icon: 'bi-droplet-fill', route: '/examens' },
    { label: 'Resultats', icon: 'bi-file-medical-fill', route: '/resultats' },
    { label: 'Hospitalisations', icon: 'bi-hospital-fill', route: '/hospitalisations' },
  ];
}
