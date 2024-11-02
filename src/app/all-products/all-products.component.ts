import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { Router, RouterModule, RouterLink } from '@angular/router';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-all-products',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, NgStyle, RouterModule, RouterLink],
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit {
  products: any[] = []; 
  isLoading: boolean = false;

  constructor(private http: HttpClient, private router: Router, private cartService: CartService) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.isLoading = true;
    const token = sessionStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<any[]>('https://auto-gear.vercel.app/admin/spare-parts', { headers })
      .subscribe({
        next: (data) => {
          this.products = data;
          console.log('Fetched products:', this.products);
          console.log('Number of products:', this.products.length); // عدد المنتجات

          // تخزين البيانات في sessionStorage
          sessionStorage.setItem('fetchedProducts', JSON.stringify(this.products));
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching products', err);
          console.log('Failed to fetch products');
          this.isLoading = false;
        }
      });
  }

  handleData(id: string): void {
    this.router.navigate(['/editProduct', id]);
  }

  deleteProduct(productId: string): void {
    this.isLoading = true;
    const token = sessionStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.delete(`https://auto-gear.vercel.app/admin/spare-parts/${productId}`, { headers })
      .subscribe({
        next: (response) => {
          console.log('Response:', response);
          this.products = this.products.filter(product => product._id !== productId);
          sessionStorage.setItem('fetchedProducts', JSON.stringify(this.products));
          this.isLoading = false;
        },
        error: (error: HttpErrorResponse) => {
          console.error('Full error response:', error);
          this.isLoading = false;
        }
      });
  }
}
