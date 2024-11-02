import { Injectable } from '@angular/core';

import { inject } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class ServerSidePaginationService {


private apiUrl2:string =`https://auto-gear.vercel.app/spare-parts/paginated`

 

  
private readonly http=inject(HttpClient);
//private readonly params=inject(HttpParams);
private readonly HttpParam = new HttpParams();



  getPagProducts(page:number){
    const params = this.HttpParam.set('page',String(page));
    return this.http.get(this.apiUrl2,{params});
  }
}
