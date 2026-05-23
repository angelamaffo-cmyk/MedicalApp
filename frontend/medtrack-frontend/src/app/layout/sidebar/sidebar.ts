import { Component, Input , OnInit} from '@angular/core';
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

  constructor(public authService: AuthService,
        public roleService: AuthRoleService

  ) {}

    ngOnInit(): void {}


  
}
