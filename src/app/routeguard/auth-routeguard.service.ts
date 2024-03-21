import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Router } from '@angular/router';

@Injectable()
export class AuthRouteguard {

  user = new User();

  constructor(private router: Router) { }

  canActivate(){
    if (window.sessionStorage.getItem('userdetails')) {
      return true;
    }else{
      this.router.navigate(['/login'])
      return false;
    }
  }
}
