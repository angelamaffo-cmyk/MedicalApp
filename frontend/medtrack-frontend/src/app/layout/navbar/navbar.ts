import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthRoleService } from '../../services/auth-role.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  isDarkMode = false;
  profil: any = null;

  constructor(
    public authService: AuthService,
    public roleService: AuthRoleService
  ) {}

  ngOnInit(): void {
    // Vérifier le thème sauvegardé
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      document.documentElement.setAttribute('data-theme', 'dark');
    } else if (!savedTheme) {
      // Vérifier la préférence système
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        this.isDarkMode = true;
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    }
    this.profil = this.authService.getProfilLocal();
  }

  onToggle(): void {
    this.toggleSidebar.emit();
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }

  getRoleLabel(): string {
    if (!this.profil) return 'Administrateur';
    const labels: any = { 'MEDECIN': 'Médecin', 'INFIRMIER': 'Infirmier' };
    return labels[this.profil.role] || this.profil.role;
  }

  getInitiales(): string {
    if (!this.profil) return 'AD';
    const nom = this.profil.nom_complet || '';
    const parts = nom.split(' ');
    if (parts.length >= 2) return parts[0][0] + parts[1][0];
    return nom.substring(0, 2).toUpperCase();
  }
}