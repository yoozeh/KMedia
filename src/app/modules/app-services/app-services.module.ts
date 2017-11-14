import { NgModule, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface KJSON {
  [key: string]: any;
}

export const APP_CONFIG = new InjectionToken<KJSON>('Configure');
export const APP_TEXT = new InjectionToken<KJSON>('Text');

class AppStaticService {

  private static _configure: KJSON = {
    httpAddress: location.protocol + '//' + location.host,
    socketAddress: (location.protocol === 'http:' ? 'ws://' : 'wss://') + location.host,
    ...require('../../../../json/configure.json')
  };
  static get configure(): KJSON { return AppStaticService._configure; }

  static _text: KJSON = require('../../../../json/language.' + AppStaticService._configure.language + '.json');
  static get text(): KJSON { return AppStaticService._text; }

}

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    { provide: APP_CONFIG, useValue: AppStaticService.configure },
    { provide: APP_TEXT, useValue: AppStaticService.text }
  ],
  declarations: []
})
export class AppServicesModule { }
