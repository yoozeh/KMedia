import { NgModule, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface AppConfigure {
  [key: string]: any;
}

export const APP_CONFIG = new InjectionToken<AppConfigure>('Configure');
export const APP_TEXT = new InjectionToken<AppConfigure>('Text');

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    { provide: APP_CONFIG, useValue: AppConfigureModule.configure },
    { provide: APP_TEXT, useValue: AppConfigureModule.text }
  ],
  declarations: []
})
export class AppConfigureModule {

  private static _configure: AppConfigure = require('../../../../json/configure.json');
  static get configure(): AppConfigure {
    return AppConfigureModule._configure;
  }

  private static _text: AppConfigure = require('../../../../json/language.' + AppConfigureModule._configure.language + '.json');
  static get text(): AppConfigure {
    return AppConfigureModule._text;
  }

}
