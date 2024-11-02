import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { catchError, finalize, of, tap } from 'rxjs';
import { Product } from '../main-page/product.model';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, ReactiveFormsModule],
  templateUrl: './edit.component.html',
  styles: [
    `
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .form-group {
        margin-bottom: 15px;
      }
      label {
        display: block;
        margin-bottom: 5px;
      }
      input,
      textarea {
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
      button {
        padding: 10px 20px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      button:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
      }
      .error-message {
        color: red;
        font-size: 0.9em;
        margin-top: 5px;
      }
      .success-message {
        color: green;
        font-size: 1em;
        margin-bottom: 15px;
      }
      .loading-spinner {
        text-align: center;
        margin: 20px 0;
      }
    `,
  ],
})
export class EditComponent implements OnInit {
  product: Product | undefined;
  productForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      title: [''],
      description: [''],
      price: [''],
      quantity: [''],
      category: [''],
      manufacturer: [''],
      image: [''],
      manufactureCountry: [''],
      vehicleType: [''],
      vehicleYear: [''],
      vehicleMaker: [''],
      vehicleModel: [''],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchProductDetails(id);
    } else {
      this.errorMessage = 'No product ID provided';
    }
  }

  fetchProductDetails(id: string): void {
    this.isLoading = true;
    this.http
      .get<Product[]>(`https://auto-gear.vercel.app/spare-parts/all`)
      .pipe(
        tap((products) => {
          this.product = products.find((pro) => pro._id === id);
          if (this.product) {
            this.productForm.patchValue(this.product);
            console.log('Fetched product:', this.product);
          } else {
            this.errorMessage = 'Product not found';
          }
        }),
        catchError((error) => {
          this.errorMessage =
            'Failed to fetch product details. Please try again.';
          console.error('Error fetching products', error);
          return of(null);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe();
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      console.log('Form submitted:', this.productForm.value);
      this.isLoading = true;
      const updatedProduct: Product = this.productForm.value;
      const id = this.route.snapshot.paramMap.get('id');

      // Retrieve the token from sessionStorage
      const token = sessionStorage.getItem('authToken');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      this.http
        .patch<Product>(
          `https://auto-gear.vercel.app/admin/spare-parts/${id}`,
          updatedProduct,
          { headers }
        )
        .pipe(
          tap((response) => {
            console.log('Response:', response); 
            if (response) {
              this.successMessage = 'Product updated successfully!';
              setTimeout(() => this.router.navigate(['/products']), 2000);
            } else {
              this.errorMessage =
                'Failed to update product. No response received.';
            }
          }),
          catchError((error) => {
            console.error('Error in catchError:', error); 
            if (error.status === 200 || error.status === 204) {
              
              this.successMessage = 'Product updated successfully!';
              setTimeout(
                () => this.router.navigate(['/admin/allproducts']),
                2000
              );
            } else {
              this.errorMessage = 'Failed to update product. Please try again.';
            }
            return of(null);
          }),
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe();
    } else {
      this.productForm.markAllAsTouched();
      this.errorMessage =
        'Please correct the errors in the form before submitting.';
    }
  }
}
