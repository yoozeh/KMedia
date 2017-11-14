import { Component, ViewChild } from '@angular/core';

import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'k-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  @ViewChild(MatSidenav) sidenav;

  onSidenav(event: string): void {
    switch (event) {
      case 'open':
        this.sidenav.open();
        break;
      case 'close':
        this.sidenav.close();
        break;
      case 'toggle':
        this.sidenav.toggle();
        break;
    }
  }

}
