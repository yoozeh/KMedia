import { Injectable, InjectionToken } from '@angular/core';

export type KT_JSON = { [key: string]: any; }

export const APP_CONFIG = new InjectionToken<KT_JSON>('Configure');
export const APP_TEXT = new InjectionToken<KT_JSON>('Text');

@Injectable()
export class AppEnvironmentsService {

  private static _configure: KT_JSON = {
    httpAddress: location.protocol + '//' + location.host,
    socketAddress:
      (location.protocol === 'http:' ? 'ws://' : 'wss://') + location.host,
    ...require('../../json/configure.json')
  };
  static get configure(): KT_JSON {
    return AppEnvironmentsService._configure;
  }
  get configure(): KT_JSON {
    return AppEnvironmentsService._configure;
  }

  private static _text: KT_JSON = require('../../json/language.' +
    AppEnvironmentsService._configure.language + '.json');
  static get text(): KT_JSON {
    return AppEnvironmentsService._text;
  }
  get text(): KT_JSON {
    return AppEnvironmentsService._text;
  }

  constructor() { }

}
