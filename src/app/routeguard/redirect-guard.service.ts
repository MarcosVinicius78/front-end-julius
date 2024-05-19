import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RedirectGuardService implements CanActivate{

  constructor(private router: Router) {}

  apiUrl: string = environment.apiUrl;

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const queryParams = route.queryParams;
    if (queryParams && queryParams['r'] === '1') {
      console.log("aquiiiii")
      this.router.navigate(['/blank'], { queryParams: { id: route.params['id'] } });
      // Se o parâmetro 'r' for igual a 1, redirecione para o método no backend Spring Boot
      window.location.href = `${this.apiUrl}/produto/${route.params['id']}?r=1`;
      return false; // Retorne false para evitar a renderização do componente Angular
    } else {
      console.log("else")
      return true; // Permita a ativação da rota normalmente
    }
  }
}
