import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { KT_JSON, APP_CONFIG } from '../app.environments.service';

@Injectable()
export class NetworkService {

  constructor(
    private _http: HttpClient,
    @Inject(APP_CONFIG) private _configure: KT_JSON
  ) { }

  public request(request: string, data?: any): Observable<any> {
    let url = this._configure.httpAddress + '/' + this._configure.path_request + '/' + request;
    let headers: HttpHeaders;
    switch (request.toLowerCase()) {
      case 'initialize':
        return this._http.get(url, { responseType: 'json' });
      case 'textfile':
        if (typeof data === 'string') {
          return this._http.get(url + '/' + data, { responseType: 'text' });
        }
        break;
      case 'check-email':
      case 'check-nickname':
        if (typeof data === 'string') {
          return this._http.get(url + '/' + data, { responseType: 'json' });
        }
        break;
      case 'sign-up':
        return this._http.post(url, data, { responseType: 'json' });
      case 'sign-in':
        return this._http.post(url, data, { responseType: 'json' });
      case 'sign-out':
        return this._http.post(url, data, { responseType: 'json' });
    }
    return null;
  }

}
