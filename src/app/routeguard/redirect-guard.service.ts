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
      const routeId = route.params['id'] || environment.site;

      if (queryParams && ['1', '2', '3'].includes(queryParams['r'])) {
        // Navegação com base no valor de 'r'
        this.router.navigate(['/blank'], { queryParams: { id: routeId, r: queryParams['r'] } });

        return false; // Evita a renderização do componente Angular
      }

      return true; // Permite a ativação da rota normalmente

  }
}
