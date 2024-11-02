import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Product } from '../main-page/product.model';
import { FavoritesService } from '../services/favorites.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';


@Component({
  selector: 'app-favorites',
  imports: [CommonModule],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css'],
  standalone: true,
})
export class FavoritesComponent implements OnInit {
  favoriteProducts$: Observable<Product[]> = of([]);

  constructor(
    private favoritesService: FavoritesService,
    private http: HttpClient,
    private router: Router,
    private cartService: CartService,
  ) {}

  ngOnInit(): void {
    this.favoriteProducts$ = this.favoritesService.favorites$.pipe(
      switchMap(favoriteIds => {
        if (favoriteIds.length === 0) {
          return of([]);
        }
        return this.http.get<Product[]>('https://auto-gear.vercel.app/spare-parts/all').pipe(
          map(products => products.filter(product => favoriteIds.includes(product._id))),
          catchError(error => {
            console.error('Error fetching products:', error);
            return of([]);
          })
        );
      })
    );
  }

  addToCart(product: Product): void {
    const productWithQuantity = { ...product, quantity: 1 };
    this.cartService.addToCart(productWithQuantity);
  }

  handleData(id: string): void {
    this.router.navigate(['/product-details', id]);
  }
 

  toggleFavorite(product: Product): void {
    if (product._id) {
      if (this.favoritesService.isFavorite(product._id)) {
        this.favoritesService.removeFavorite(product._id);
      } else {
        this.favoritesService.addFavorite(product._id);
      }
    }
  }

  isFavorite(product: Product): boolean {
    return product._id ? this.favoritesService.isFavorite(product._id) : false;
  }
}