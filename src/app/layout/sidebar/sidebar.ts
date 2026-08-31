import { Component } from '@angular/core';
import {
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import {
  AuthService
} from '../../core/services/auth';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {

  constructor(
    private authService: AuthService
  ) {}

  esAdministrador(): boolean {
    return this.authService.isAdmin();
  }

  esEstudiante(): boolean {
    return this.authService.isEstudiante();
  }

}
