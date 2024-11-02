import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgIf } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, retry, throwError } from 'rxjs';

interface RegistrationForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent {
  form: RegistrationForm = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  onSubmit(registrationForm: NgForm): void {
    if (registrationForm.valid) {
      console.log('Form data before submission:', this.form);
      this.http
        .post('https://auto-gear.vercel.app/register', this.form)
        .pipe(
          retry(3),
          catchError(this.handleError)
        )
        .subscribe({
          next: (response: any) => {
            console.log('Registration response:', response);
            if (response && response.token) {
              console.log('Token:', response.token);
              this.authService.setToken(response.token);

              const redirectUrl = this.authService.getRedirectUrl();
              if (redirectUrl) {
                this.authService.clearRedirectUrl();
                alert('Registration successful! Redirecting to cart...');
                this.router.navigate([redirectUrl]);
              } else {
                alert('Registration successful! Redirecting to homepage...');
                this.router.navigate(['/']);
              }
            } else {
              console.error('Invalid response format:', response);
              alert('Registration successful, but there was an issue with the server response. Please try logging in.');
            }
          },
          error: (error: any) => {
            console.error('Registration error:', error);
            alert(error);
          },
        });
    } else {
      console.log('Form is invalid');
      alert('Please fill in all required fields correctly.');
    }
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error details:', error);
    if (error.status === 0) {
      return throwError(() => 'Unable to connect to the server. Please check your internet connection and try again.');
    } else if (error.status === 400) {
      const validationErrors = error.error.errors;
      return throwError(() => 'Registration failed: ' + (validationErrors ? validationErrors.join(', ') : 'Unknown validation error'));
    } else {
      return throwError(() => 'An unexpected error occurred. Please try again later.');
    }
  }
}
