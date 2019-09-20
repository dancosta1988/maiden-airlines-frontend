import { Injectable, Inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { SESSION_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BasicAuthHtppInterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
    
    if (localStorage.getItem('token')) {
      req = req.clone({
        setHeaders: {
          Authorization: localStorage.getItem('token')
        }
      })
    }
    return next.handle(req);
  }

}