import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'k-foundation',
  templateUrl: './foundation.component.html',
  styleUrls: ['./foundation.component.css']
})
export class FoundationComponent implements OnInit {

  @ViewChild(MatSidenav)
  private _sidenav: MatSidenav;

  constructor(
    private _router: Router
  ) { }

  public ngOnInit(): void {
    this._router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this._router.navigated = false;
        window.scrollTo(0, 0);
      }
    });
  }

  public onSidenav(event: string): void {
    switch (event) {
      case 'open':
        this._sidenav.open();
        break;
      case 'close':
        this._sidenav.close();
        break;
      case 'toggle':
        this._sidenav.toggle();
        break;
    }
  }

}
