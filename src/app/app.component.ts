import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'julius-da-promo-front-end';

  showHeader = true;
  showFooter = true;

  constructor(private router: Router, private activatedRoute: ActivatedRoute){}

  // shouldShowComponent(): boolean {

  //   let route = this.router;
  //   while (route.firstChild) {
  //     route = route.firstChild;
  //   }
  //   // Verificar se a rota atual é a rota desejada
  //   const currentPath = route.snapshot.routeConfig?.path;
  //   return currentPath !== undefined && !['/'].includes(currentPath);
  // }

  ngOnInit(): void {
  // Adiciona um ouvinte para as alterações de rota
  this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
    // Verifica a rota ativa
    const route = this.activatedRoute.firstChild;
    if (route) {
        this.showHeader = (route.snapshot.data['hideHeader'] as boolean);
        this.showFooter = (route.snapshot.data['hideFooter'] as boolean);
      }
    });
  }

  
}
