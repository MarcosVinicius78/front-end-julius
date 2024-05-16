import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
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

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private meta: Meta
  ){}

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
