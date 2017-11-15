import { Component, OnInit, ViewEncapsulation, Inject, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { retry } from 'rxjs/operators';

import { KJSON, APP_CONFIG, APP_TEXT } from '../../../modules/app-services/app-services.module';

import * as md from 'markdown-it';

@Component({
  selector: 'k-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TermsComponent implements OnInit {

  @Input() public index: number;

  private _md = new md({
    html: true,
    //linkify: true,
    typographer: true
  });

  private _isLoading: boolean = true;
  get isLoading(): boolean { return this._isLoading; }

  private _title: string;
  get title(): string { return this._title; }

  private _contents: string;
  get contents(): string { return this._contents; }

  constructor(
    @Inject(APP_CONFIG) private _configure: KJSON,
    @Inject(APP_TEXT) public text: KJSON,
    private _http: HttpClient
  ) { }

  ngOnInit() {
    this._isLoading = true;
    let filename: string = null;
    switch (this.index) {
      case 1:
        this._title = this.text.terms_of_service;
        filename = this._configure.httpAddress + this._configure.path_terms_of_service;
        break;
      case 2:
        this._title = this.text.privacy_policy;
        filename = this._configure.httpAddress + this._configure.path_privacy_policy;
        break;
      case 3:
        this._title = this.text.user_location;
        filename = this._configure.httpAddress + this._configure.path_user_location;
        break;
    }
    if (filename) {
      this._http
        .get(filename, { responseType: 'text' })
        .pipe(retry(3))
        .subscribe(
        (data) => {
          this._contents = this._md.render(data);
          this._isLoading = false;
        },
        (error) => { }
        );
    }
  }

}
