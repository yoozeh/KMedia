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

  public request(request: string, target: string, data?: any): Observable<any> {
    let url = this._configure.httpAddress + '/' + this._configure.path_request + '/' + request;
    let headers: HttpHeaders;
    switch (request.toLowerCase()) {
      case 'textfile':
        return this._http.get(url + '/' + target, { responseType: 'text' });
      case 'check-email':
        return this._http.get(url + '/' + target, { responseType: 'json' });
      case 'check-nickname':
        return this._http.get(url + '/' + target, { responseType: 'json' });
      case 'sign-up':
        return this._http.post(url, data, { responseType: 'json' });
    }
    return null;
  }

}
