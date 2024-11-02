import { Component, OnInit } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { order } from './Order';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [NgFor,NgIf],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  protected readonly auth = inject(AuthService);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  protected orders:order[]=[];
  private  HttpHeader=new HttpHeaders();
  private token = this.auth.getToken();

  
  ngOnInit(): void {
   console.log(this.auth.isLoggedIn());
    if (!this.auth.isLoggedIn()) {

      this.auth.setRedirectUrl('/orders');
      this.router.navigate(['/login']);
    }
    else
    {
      const auth_header = this.HttpHeader.set('Authorization','Bearer '+this.token)
     
    this.http.get<order[]>('https://auto-gear.vercel.app/orders',{headers:auth_header}).subscribe((orders:order[]) => {

     
      this.orders = orders; 
      
      console.log();
    });
  }
  
  }


}
