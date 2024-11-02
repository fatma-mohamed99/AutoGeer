import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | null = null;
  private redirectUrl: string | null = null;
  private logoutSubject = new BehaviorSubject<void>(undefined); 

   $ = this.logoutSubject.asObservable();

  constructor(private router: Router) {
    this.token = localStorage.getItem('token');
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }
  checkout(bool:string){
    localStorage.setItem('ischeckout',bool);

  }

  getToken(): string | null {
    return this.token;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('token');
    this.logoutSubject.next(); 
    this.router.navigate(['/login']);
    location.reload() 
  }

  setRedirectUrl(url: string): void {
    this.redirectUrl = url;
  }

  getRedirectUrl(): string | null {
    return this.redirectUrl;
  }

  clearRedirectUrl(): void {
    this.redirectUrl = null;
  }
}
