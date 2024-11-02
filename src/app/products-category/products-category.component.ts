import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../services/cart.service';
import { FavoritesService } from '../services/favorites.service';
import { Product } from '../main-page/product.model'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-products-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products-category.component.html',
  styleUrls: ['./products-category.component.css'],
})
export class ProductsCategoryComponent implements OnInit {
  category: string = '';
  products: Product[] = [];
  filteredProducts: Product[] = [];
  uniqueCountries: string[] = [];
  selectedCountry: string = '';
  selectedPriceRange: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private cartService: CartService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.category = decodeURIComponent(params.get('category') || '');
      this.fetchProducts();
    });
  }

  fetchProducts(): void {
    this.http.get<Product[]>('https://auto-gear.vercel.app/spare-parts/all').subscribe({
      next: (data) => {
        this.products = data;
        this.uniqueCountries = [...new Set(data.map(product => product.manufactureCountry))];
        this.filterProductsByCategory();
      },
      error: (err) => {
        console.error('Error fetching products', err);
      }
    });
  }

  filterProductsByCategory(): void {
    this.filteredProducts = this.products.filter(product => product.category === this.category);
  }

  applyFilters(): void {
    let filtered = this.products.filter(product => product.category === this.category);

    if (this.selectedCountry) {
      filtered = filtered.filter(product => product.manufactureCountry === this.selectedCountry);
    }

    if (this.selectedPriceRange) {
      if (this.selectedPriceRange === '0-200') {
        filtered = filtered.filter(product => product.price >= 0 && product.price < 200);
      } else if (this.selectedPriceRange === '200-500') {
        filtered = filtered.filter(product => product.price >= 200 && product.price < 500);
      } else if (this.selectedPriceRange === '500+') {
        filtered = filtered.filter(product => product.price >= 500);
      }
    }

    this.filteredProducts = filtered;
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
        console.log('Removed from favorites:', product._id);
      } else {
        this.favoritesService.addFavorite(product._id);
        console.log('Added to favorites:', product._id);
      }
    }
  }

  isFavorite(product: Product): boolean {
    const favorites = this.favoritesService.getFavorites();
    return favorites.includes(product._id);
  }
}
