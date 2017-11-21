import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry, debounceTime } from 'rxjs/operators';

import { KT_JSON, APP_CONFIG } from '../app.environments.service';

@Injectable()
export class NetworkService {

  constructor(
    private _http: HttpClient,
    @Inject(APP_CONFIG) private _configure: KT_JSON
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
