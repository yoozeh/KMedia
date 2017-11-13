import { Component, Inject } from '@angular/core';

import { AppJSON, APP_TEXT } from './modules/app-services/app-services.module';

@Component({
  selector: 'k-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(@Inject(APP_TEXT) public text: AppJSON) {
    console.log(text);
  }
}
