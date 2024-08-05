import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RedirectGuardService implements CanActivate{

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  apiUrl: string = environment.apiUrl;

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const queryParams = route.queryParams;
    if (queryParams && queryParams['r'] === '1') {
      // this.router.navigate(['/blank'], { queryParams: { id: route.params['id'] } });

      this.router.navigate(['/blank'], { queryParams: { id: route.params['id'], r: '1' } });


      // Se o parâmetro 'r' for igual a 1, redirecione para o método no backend Spring Boot
      // if (isPlatformBrowser(this.platformId)) {
      //   window.location.href = `${this.apiUrl}/produto/${route.params['id']}?r=1`;
      // }
      return false; // Retorne false para evitar a renderização do componente Angular
    } else {
      return true; // Permita a ativação da rota normalmente
    }
  }
}
