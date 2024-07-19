import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class AuthRouteguard {

  user = new User();

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  canActivate() {
    if (isPlatformBrowser(this.platformId)) {
      if (window.sessionStorage.getItem('userdetails')) {
        return true;
      }
    }
    this.router.navigate(['/login']);
    return false;
  }
}
