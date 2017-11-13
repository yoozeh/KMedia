import { NgModule, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface AppJSON {
  [key: string]: any;
}

export const APP_CONFIG = new InjectionToken<AppJSON>('Configure');
export const APP_TEXT = new InjectionToken<AppJSON>('Text');

const CONFIGURE: AppJSON = require('../../../../json/configure.json');
const TEXT: AppJSON = require('../../../../json/language.' + CONFIGURE.language + '.json');

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    { provide: APP_CONFIG, useValue: CONFIGURE },
    { provide: APP_TEXT, useValue: TEXT }
  ],
  declarations: []
})
export class AppConfigureModule { }
