import { Component, Input , OnInit, Output,EventEmitter} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthRoleService } from '../../services/auth-role.service';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent {
  @Input() isOpen = true;
  @Output() closeSidebar = new EventEmitter<void>();
    isMobile = false;


  constructor(public authService: AuthService,
        public roleService: AuthRoleService

  ) {}

    ngOnInit(): void {
      this.checkMobile();
    window.addEventListener('resize', () => this.checkMobile());
  
    }
    checkMobile(): void {
    this.isMobile = window.innerWidth <= 768;
  }
    fermer(): void {
    this.closeSidebar.emit();
  }
  fermerEnMobile(): void {
    if (this.isMobile) {
      this.closeSidebar.emit();
    }
  }


  
}
