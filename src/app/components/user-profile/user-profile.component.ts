import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'k-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  private _nickname: string;
  get nickname(): string {
    return this._nickname;
  }

  private _account: string;
  get account(): string {
    return this._account;
  }

  private _picURL: string;
  get picURL(): string {
    return this._picURL;
  }

  constructor() { }

  ngOnInit(): void {
    this._nickname = 'Shiba Inu';
    this._account = 'shiba_inu';
    this._picURL = 'https://material.angular.io/assets/img/examples/shiba1.jpg';
  }

}
