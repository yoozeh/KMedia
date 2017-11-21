import { Component, OnInit, Inject, Input } from '@angular/core';

import * as MarkdownIt from 'markdown-it';

import { KT_JSON, APP_TEXT } from '../../app.environments.service';
import { NetworkService } from '../../services/network.service';

@Component({
  selector: 'k-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css']
})
export class TermsComponent implements OnInit {

  @Input()
  public index: number;

  private _md: MarkdownIt.MarkdownIt;

  private _isLoading: boolean = true;
  get isLoading(): boolean {
    return this._isLoading;
  }

  private _contents: string;
  get contents(): string {
    return this._contents;
  }

  constructor(
    private _network: NetworkService,
    @Inject(APP_TEXT) public text: KT_JSON
  ) { }

  ngOnInit(): void {
    this._md = new MarkdownIt({
      html: true,
      //linkify: true,
      typographer: true
    });
    this._isLoading = true;
    let filename: string = null;
    switch (this.index) {
      case 1:
        filename = this.text.file_terms_of_service;
        break;
      case 2:
        filename = this.text.file_privacy_policy;
        break;
      case 3:
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
