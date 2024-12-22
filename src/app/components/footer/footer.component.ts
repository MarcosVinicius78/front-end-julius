import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LinksBanner } from 'src/app/dto/LinksBanner';
import { AtivarRodapéService } from 'src/app/service/ativarRodapé.service';
import { LinkBannerService } from 'src/app/service/painel/link-banner.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit{

  constructor(
  ){}

  ngOnInit(): void {
  }
}
