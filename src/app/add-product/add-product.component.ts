import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [NgClass, NgIf, ReactiveFormsModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  productForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      quantity: [null, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      manufacturer: ['', Validators.required],
      image: ['', Validators.required],
      manufactureCountry: ['', Validators.required],
      vehicleType: ['', Validators.required],
      vehicleYear: ['', Validators.required],
      vehicleMaker: ['', Validators.required],
      vehicleModel: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Additional initialization logic if needed
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    const token = sessionStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.post('https://auto-gear.vercel.app/admin/spare-parts', this.productForm.value, { headers })
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = 'Product added successfully!';
          this.productForm.reset();
          setTimeout(() => this.router.navigate(['/admin/allproducts']), 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Failed to add product. Please try again.';
          console.error('Error adding product:', error);
        }
      });
  }
}
