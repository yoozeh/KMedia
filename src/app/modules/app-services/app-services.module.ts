import { NgModule, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface AppJSON {
  [key: string]: any;
}

class AppJSONValuse {
  private static _configure: AppJSON = require('../../../../json/configure.json');
  static get configure(): AppJSON {
    return AppJSONValuse._configure;
  }
  static _text: AppJSON = require('../../../../json/language.' + AppJSONValuse._configure.language + '.json');
  static get text(): AppJSON {
    return AppJSONValuse._text;
  }
}

export const APP_CONFIG = new InjectionToken<AppJSON>('Configure');
export const APP_TEXT = new InjectionToken<AppJSON>('Text');

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    { provide: APP_CONFIG, useValue: AppJSONValuse.configure },
    { provide: APP_TEXT, useValue: AppJSONValuse.text }
  ],  
  declarations: []
})
export class AppServicesModule { }
