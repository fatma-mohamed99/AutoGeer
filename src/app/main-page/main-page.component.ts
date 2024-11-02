import { HttpClient } from '@angular/common/http';
import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { Product } from './product.model';
import { FavoritesService } from '../services/favorites.service';
import { ServerSidePaginationService } from '../services/server-side-pagination.service';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, NgStyle],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent implements OnInit {
  private readonly serverSidePag = inject(ServerSidePaginationService);
  protected pagesArr: number[] = [];
  private productsPerPage: number = 0;
  protected currentPage: number = 1;
  protected productarr: Product[] = [];
  private totalProducts: number = 0;
  protected totalPages: number = 1;
  protected next: boolean = true;
  protected prev: boolean = false;
  filteredProducts: Product[] = [];
  categories: { title: string; image: string }[] = [
    {
      title: 'oil filters',
      image:
        'https://cdn.iconscout.com/icon/premium/png-512-thumb/oil-filter-3402967-2836815.png?f=webp&w=256',
    },
    {
      title: 'car battries',
      image: 'https://cdn-icons-png.flaticon.com/128/2087/2087628.png',
    },
    {
      title: 'Wiper Blades',
      image: 'https://cdn-icons-png.flaticon.com/128/3374/3374671.png',
    },
    {
      title: 'Spark Plugs',
      image: 'https://cdn-icons-png.flaticon.com/128/10690/10690314.png',
    },
  ];

  constructor(
    private http: HttpClient,
    private router: Router,
    private cartService: CartService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    
    this.serverSidePag.getPagProducts(this.currentPage).subscribe({
        next: (data) => {
          this.productarr =  Object.values(data)[0];
          this.filteredProducts = this.productarr;
          console.log('Fetched products:', this.productarr);

          console.log('Fetched products:', this.filteredProducts);
          this.totalPages = Object.values(data)[1];
          this.pagesArr = this.PagesArr;
          this.currentPage = Object.values(data)[2];    
          this.prev = Object.values(data)[3];
          this.next = Object.values(data)[4];
    
          console.log(this.totalPages);
        },
        error: (err) => {
          console.error('Error fetching products', err);
          console.log('Failed to fetch products');
        },
        
      });
  }

  handleData(id: string): void {
    this.router.navigate(['/product-details', id]);
  }

  isTitleLong(title: string): boolean {
    return title.split(' ').length > 3;
  }

  addToCart(product: Product): void {
    this.cartService.addToCart({ ...product, quantity: 1 });
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

  onCategoryChange(category: string): void {
    if (category === 'All') {
      this.filteredProducts = this.productarr;
    } else {
      this.filteredProducts = this.productarr.filter(
        (product) => product.category == category
      );
    }
  }

  get TotalPages(): number {
    return Math.ceil(this.totalProducts / this.productsPerPage);
  }
  get PagesArr(): number[] {
    return this.range(1, this.totalPages);
  }

  // fetchProducts2() {
  //   this.serverSidePag.getPagProducts2(this.currentPage).subscribe((data) => {
  //     this.totalPages = Object.values(data)[1];
  //     this.pagesArr = this.PagesArr;
  //     this.currentPage = Object.values(data)[2];
  //     this.productarr = Object.values(data)[0];

  //     this.prev = Object.values(data)[3];
  //     this.next = Object.values(data)[4];

  //     console.log(this.productarr);
  //   });
  // }
  range(start: number, end: number): number[] {
    return [...Array(end).keys()].map((elm) => (elm += start));
  }

  onPrevClick2(): void {
    if (this.prev) {
      this.currentPage--;
      this.onPageChange2(this.currentPage);
    }
  }

  onNextClick2(): void {
    if (this.next) {
      this.currentPage++;
      this.onPageChange2(this.currentPage);
    }
  }

  changeCurrentPage(page: number): void {
    if (
      page &&
      page >= 1 &&
      page <= this.totalPages &&
      page !== this.currentPage
    ) {
      this.currentPage = page;
    }
  }

  onPageChange2(page: number): void {
    this.changeCurrentPage(page);

    this.fetchProducts();
  }
}
