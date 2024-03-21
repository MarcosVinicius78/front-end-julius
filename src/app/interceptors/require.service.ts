import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/user';

@Injectable()
export class RequireService implements HttpInterceptor {

  user = new User();
  constructor(private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let httpHeaders = new HttpHeaders();

    if (sessionStorage.getItem('userdetails')) {
      this.user = JSON.parse(sessionStorage.getItem('userdetails')!);
    }

    if (this.user && this.user.password && this.user.username) {

      httpHeaders = httpHeaders.append('Authorization', 'Basic ' + window.btoa(this.user.username + ':' + this.user.password));
    } else {
      let authorization = sessionStorage.getItem('Authorization');
      if (authorization) {
        httpHeaders = httpHeaders.append('Authorization', authorization);
      }
    }

    let xsrf = sessionStorage.getItem('XSRF-TOKEN');
    if (xsrf) {
      httpHeaders = httpHeaders.append('X-XSRF-TOKEN', xsrf);
    }

    httpHeaders = httpHeaders.append('X-Requested-With', 'XMLHttpRequest');
    const xhr = req.clone({
      headers: httpHeaders
    });

    return next.handle(xhr).pipe(tap(
      (err: any) => {
        if (err instanceof HttpErrorResponse) {
          console.log("passou")
          if (err.status !== 401) {
            return;
          }
          // this.router.navigate(['dashboard']);
        }
      }, error => {
        if (error.status === 401) {
          window.sessionStorage.removeItem('userdetails')
          window.sessionStorage.removeItem('Authorization')
          this.router.navigate(['login'])
        }
      }));
  }
}
