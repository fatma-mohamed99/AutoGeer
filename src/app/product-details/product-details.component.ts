import { Component, Input, OnInit } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { DiscountPricePipe } from "../discount-price.pipe";
import { CartService } from '../services/cart.service';
import { Product } from '../main-page/product.model'; 
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [NgFor, NgClass, NgIf, DiscountPricePipe],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  products: Product[] = [];
  product: Product | undefined;

  constructor(
    private http: HttpClient, 
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchProductDetails(id);
    }
  }

  fetchProductDetails(id: string): void {
    this.http.get<Product[]>(`https://auto-gear.vercel.app/spare-parts/all`)
      .subscribe({
        next: (data) => {
          this.products = data;
          this.product = this.products.find((pro) => pro._id === id);
          console.log(this.product)
          console.log(id)

          if (!this.product) {
            console.error('Product not found');
          } else {
            console.log('Fetched product:', this.product);
          }
        },
        error: (err) => {
          console.error('Error fetching products', err);
        }
      });
  }


  addToCart(): void {
    if (this.product) {
      console.log('Adding to cart:', this.product);
      this.cartService.addToCart({ ...this.product, quantity: 1 });
    }
  }
}
