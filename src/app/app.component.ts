import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'k-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild(MatSidenav) private _sidenav;

  onSidenav(event: string): void {
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
