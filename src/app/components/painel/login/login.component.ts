import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './../../../service/painel/auth.service';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { getCookie } from 'typescript-cookie';
// import {MatButtonModule} from '@angular/material/button';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  userForm!: FormGroup;

  senhaErrada: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: Router
  ) { }


  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      senha: ['', [Validators.required]]
    })
  }

  login() {
    this.authService.login(this.userForm.get(['email'])?.value, this.userForm.get(['senha'])?.value).subscribe(reposnse => {
      if (typeof sessionStorage !== 'undefined') {
        // Acesso seguro ao sessionStorage aqui
        window.sessionStorage.setItem("Authorization", reposnse.headers.get('Authorization')!);
        let xsrf = getCookie("XSRF-TOKEN")!;
        window.sessionStorage.setItem("userdetails", JSON.stringify("logado"))
        window.sessionStorage.setItem("XSRF-TOKEN", xsrf);
        this.route.navigate(['painel']);
      }
    }, err => {
      if (err.status === 401) {
        this.senhaErrada = true;
      }
    })

  }
}
