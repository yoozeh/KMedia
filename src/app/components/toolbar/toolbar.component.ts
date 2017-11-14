import { Component, OnInit, ViewEncapsulation, Inject, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

import { AppJSON, APP_TEXT } from '../../modules/app-services/app-services.module';

@Component({
  selector: 'k-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ToolbarComponent implements OnInit {

  @Output() public eventEmitter: EventEmitter<string> = new EventEmitter();

  constructor(
    @Inject(APP_TEXT) public text: AppJSON,
    private _router: Router
  ) { }

  ngOnInit() { }

  onClickMenu() {
    this.eventEmitter.emit('toggle');
  }

  onClickLogo() {
    this._router.navigate(['']);
  }

  onClickLogin() { }

  onClickJoin() {
    this._router.navigate(['join']);
  }

}
