          import { Component, EventEmitter, Output } from '@angular/core';
          import { RouterLink, RouterLinkActive } from '@angular/router';
          import { CartService } from '../services/cart.service'; 
          import { NgClass, NgIf } from '@angular/common';
          import { AuthService } from '../services/auth.service';

          @Component({
            selector: 'app-nav',
            standalone: true,
            imports: [NgIf,RouterLink,RouterLinkActive,NgClass],
            templateUrl: './nav.component.html',
            styleUrl: './nav.component.css'
          })
          export class NavComponent {
            @Output() openLogin = new EventEmitter<void>();
  @Output() openRegistration = new EventEmitter<void>();

  totalItems = 0;
  login: boolean = false; 

  constructor(private cartService: CartService, private authService: AuthService) {}

  ngOnInit(): void {
    this.login = this.authService.isLoggedIn();
    

    this.cartService.totalItems$.subscribe(total => {
      this.totalItems = total;
    });
  }

  logOut(): void {
    this.authService.logout();
    this.login = false;
  }

  openLoginModal(): void {
    this.openLogin.emit();
  }

  openRegistrationModal(): void {
    this.openRegistration.emit();
  }
}

