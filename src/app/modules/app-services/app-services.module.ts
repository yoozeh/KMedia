import { NgModule, Injectable, Inject, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { retry, debounceTime } from 'rxjs/operators';

export interface KJSON {
  [key: string]: any;
}

export const APP_CONFIG = new InjectionToken<KJSON>('Configure');
// export const APP_COUNTRY_CODE = new InjectionToken<KJSON>('Country code');
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

@Injectable()
export class NetworkService {

  constructor(
    @Inject(APP_CONFIG) private _configure: KJSON,
    private _http: HttpClient
  ) { }

  public request(request: string, target: string, data?: any): Observable<any> {
    let url = this._configure.httpAddress + '/' + this._configure.path_request + '/' + request + '/';
    switch (request.toLowerCase()) {
      case 'textfile':
        return this._http.get(url + target, { responseType: 'text' }).pipe(retry(3));
      case 'check-email':
        return this._http.get(url + target, { responseType: 'json' });
      case 'check-nickname':
        return this._http.get(url + target, { responseType: 'json' });
    }
    return null;
  }
}

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    { provide: APP_CONFIG, useValue: AppStaticService.configure },
    { provide: APP_TEXT, useValue: AppStaticService.text },
    NetworkService,
  ]
})
export class AppServicesModule { }
