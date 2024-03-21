import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'src/app/models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = environment.apiUrl

  constructor(
    private http: HttpClient
  ){}

  login(username: any, password: any){

    let user = new User();

    user.username = username;
    user.password = password;

    window.sessionStorage.setItem('userdetails', JSON.stringify(user));

    return this.http.get(`${this.apiUrl}/user`, {observe: 'response', withCredentials: true});
  }
}
