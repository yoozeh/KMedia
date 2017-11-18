import { Component, OnInit, ViewEncapsulation, Inject, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

import { KJSON, APP_TEXT } from '../../modules/app-services/app-services.module';

@Component({
  selector: 'k-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ToolbarComponent implements OnInit {

  @Output() public eventEmitter: EventEmitter<string> = new EventEmitter();

  constructor(
    @Inject(APP_TEXT) public text: KJSON,
    private _router: Router
  ) { }

  ngOnInit(): void { }

  onClickMenu(): void {
    this.eventEmitter.emit('toggle');
  }

  onClickLogo(): void {
    this._router.navigate(['']);
  }

  onClickLogin(): void { }

  onClickJoin(): void {
    this._router.navigate(['sign-up']);
  }

}
