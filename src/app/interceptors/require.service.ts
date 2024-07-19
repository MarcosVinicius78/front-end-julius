import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class RequireService implements HttpInterceptor {

  user = new User();
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    let httpHeaders = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {


      if (typeof sessionStorage !== 'undefined') {
        // Acesso seguro ao sessionStorage aqui
        if (sessionStorage.getItem('userdetails')) {
          this.user = JSON.parse(sessionStorage.getItem('userdetails')!);
        }
      }

      if (this.user && this.user.password && this.user.username) {

        httpHeaders = httpHeaders.append('Authorization', 'Basic ' + window.btoa(this.user.username + ':' + this.user.password));
      } else {
        if (typeof sessionStorage !== 'undefined') {
          // Acesso seguro ao sessionStorage aqui
          let authorization = sessionStorage.getItem('Authorization');
          if (authorization) {
            httpHeaders = httpHeaders.append('Authorization', authorization);
          }
        }
      }

      if (typeof sessionStorage !== 'undefined') {
        // Acesso seguro ao sessionStorage aqui
        let xsrf = sessionStorage.getItem('XSRF-TOKEN');
        if (xsrf) {
          httpHeaders = httpHeaders.append('X-XSRF-TOKEN', xsrf);
        }
      }
    }

    httpHeaders = httpHeaders.append('X-Requested-With', 'XMLHttpRequest');
    const xhr = req.clone({
      headers: httpHeaders
    });

    return next.handle(xhr).pipe(tap(
      (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status !== 401) {
            return;
          }
          // this.router.navigate(['dashboard']);
        }
      }, error => {
        if (error.status === 401) {
          if (typeof sessionStorage !== 'undefined') {
            if (isPlatformBrowser(this.platformId)) {
              // Acesso seguro ao sessionStorage aqui
              window.sessionStorage.removeItem('userdetails')
              window.sessionStorage.removeItem('Authorization')
            }
              this.router.navigate(['login'])
          }
        }
      }));
  }
}
