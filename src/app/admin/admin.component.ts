import { Component, OnInit } from '@angular/core';
import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { Router, RouterModule, RouterLink } from '@angular/router'; 


import { AuthService } from '../auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, NgStyle, RouterModule, RouterLink], 
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'] 
})
export class AdminComponent{

  constructor(private authService: AuthService, private router: Router) { }

  onLogout(): void {
    this.authService.removeToken();
    this.router.navigate(['/']);
  }


}
