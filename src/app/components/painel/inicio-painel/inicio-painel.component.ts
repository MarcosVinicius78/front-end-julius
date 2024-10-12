import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio-painel',
  templateUrl: './inicio-painel.component.html',
  styleUrls: ['./inicio-painel.component.scss']
})
export class InicioPainelComponent implements OnInit {

  constructor(
    private route: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
  }

}
