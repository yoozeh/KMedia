import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { NetworkService } from './network.service';

@Injectable()
export class UserService implements OnDestroy {

  private static getCookie(cookieName) {
    let name: string = cookieName + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let cookieArray: string[] = decodedCookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(name) == 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
    return "";
  }

  private _id: string = undefined;
  private _email: string = undefined;
  get email(): string {
    return this._email;
  }
  private _nickname: string = undefined;
  get nickname(): string {
    return this._nickname;
  }

  get signed(): boolean {
    return this._id !== undefined && this._id.length > 0 &&
      this._email !== undefined && this._email.length > 0 &&
      this._nickname !== undefined && this._nickname.length > 0;
  }

  constructor(private _network: NetworkService) {
    this._getCookie();
    this._network.request('initialize').subscribe((value) => {
      this._getCookie();
    });
  }

  private _getCookie() {
    this._id = UserService.getCookie('id');
    this._email = UserService.getCookie('email');
    this._nickname = UserService.getCookie('nickname');
  }

  public signIn(email: string, password: string): Observable<any> {
    return this._network.request('sign-in', {
      email: email, password: password
    }).pipe(map((value) => {
      if (value.result || value.message === 'signed') {
        this._getCookie();
      }
      return value;
    }))
  }

  public signOut(): Observable<any> {
    return this._network.request('sign-out');
  }

  public ngOnDestroy(): void {
    this.signOut();
  }

}
