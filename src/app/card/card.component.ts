import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { Product } from '../main-page/product.model';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  cartItems: Product[] = [];
  totalItems = 0;
  totalPrice = 0;
  isCheckOut = "ok";
  errorMessage: string = '';

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient 
  ) { }

  ngOnInit(): void {
    this.authService.setRedirectUrl('/card');
    this.getCartItems();
  }

  getCartItems(): void {
    this.cartItems = this.cartService.getCartItems();
    this.calculateCartSummary();
  }

  updateCart(item: Product): void {
    this.cartService.updateCart(item);
    this.calculateCartSummary();
  }

  removeFromCart(item: Product): void {
    this.cartService.removeFromCart(item);
    this.getCartItems();
  }

  calculateCartSummary(): void {
    this.totalItems = this.cartItems.reduce((acc, item) => acc + item.quantity, 0);
    this.totalPrice = this.cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }

  checkout(): void {
    if (this.authService.isLoggedIn()) {
      const token = this.authService.getToken();
      if (!token) {
        console.error('No token available. User may not be properly authenticated.');
        this.errorMessage = 'Authentication failed. Please log in again.';
        this.router.navigate(['/login']);
        return;
      }

      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      
      const orderData = {
        items: this.cartItems.map(item => ({
          item: item.title,
          image:item.image,
          quantity: item.quantity,
          price: item.price
        })),
        totalPrice: this.totalPrice
      };

      console.log('Sending order with token:', token);
      console.log('Order data:', orderData);

      this.http.post('https://auto-gear.vercel.app/orders', orderData, { headers, responseType: 'text' })
        .pipe(
          map(response => {
            try {
              return JSON.parse(response);
            } catch (error) {
              return { success: true, message: 'Order created successfully, but response is not JSON.' };
            }
          }),
          catchError(this.handleError)
        )
        .subscribe({
          next: (response) => {
            console.log('Order response:', response);
            if (response.success) {
              console.log('Order processed successfully.');
            } else {
              this.errorMessage = response.message;
            }
          },
          error: (error) => {
            console.error('Error during checkout:', error);
            this.errorMessage = error.message || 'An error occurred during checkout.';
          }
        });
    
    } else {
      console.log('User not logged in. Redirecting to login page...');
      this.router.navigate(['/login']);
    }
  }

  private handleError(error: HttpErrorResponse): Observable<any> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error && typeof error.error === 'string') {
        errorMessage += `\nDetails: ${error.error}`;
      }
    }
    console.error(errorMessage);
    return of({ success: false, message: errorMessage });
  }
}