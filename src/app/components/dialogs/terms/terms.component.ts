import { Component, OnInit, ViewEncapsulation, Inject, Input } from '@angular/core';

import { KJSON, APP_TEXT, NetworkService } from '../../../modules/app-services/app-services.module';

import * as md from 'markdown-it';

@Component({
  selector: 'k-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class TermsComponent implements OnInit {

  @Input() public index: number;

  private _md: md;

  private _isLoading: boolean = true;
  get isLoading(): boolean { return this._isLoading; }

  private _title: string;
  get title(): string { return this._title; }

  private _contents: string;
  get contents(): string { return this._contents; }

  constructor(
    @Inject(APP_TEXT) public text: KJSON,
    private _network: NetworkService
  ) { }

  ngOnInit(): void {
    this._md = new md({
      html: true,
      //linkify: true,
      typographer: true
    });
    this._isLoading = true;
    let filename: string = null;
    switch (this.index) {
      case 1:
        this._title = this.text.terms_of_service;
        filename = this.text.file_terms_of_service;
        break;
      case 2:
        this._title = this.text.privacy_policy;
        filename = this.text.file_privacy_policy;
        break;
      case 3:
        this._title = this.text.user_location;
        filename = this.text.file_user_location;
        break;
    }
    if (filename) {
      this._network.request('textfile', filename).subscribe(
        (response) => {
          this._contents = this._md.render(response);
          this._isLoading = false;
        },
        (error) => { console.log(error) }
      );
    }
  }

}
