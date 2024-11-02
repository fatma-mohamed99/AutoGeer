import { HttpInterceptorFn } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authToken = sessionStorage.getItem('authToken');

  if (authToken && req.url.startsWith('https://auto-gear.vercel.app/admin/spare-parts')) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });

    console.log('Authorization Header Added:', clonedRequest.headers.get('Authorization'));

    return next(clonedRequest);
  }

  return next(req);
};