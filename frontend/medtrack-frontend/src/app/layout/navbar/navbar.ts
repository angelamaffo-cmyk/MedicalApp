import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent {
@Output() toggleSidebar = new EventEmitter<void>();

  constructor(public authService: AuthService) {}

  onToggle(): void {
    this.toggleSidebar.emit();
  }
}
