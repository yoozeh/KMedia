import { Component, OnInit, Inject, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

import { KT_JSON, APP_TEXT } from '../../app.environments.service';

@Component({
  selector: 'k-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  @Output()
  public eventEmitter: EventEmitter<string> = new EventEmitter();

  constructor(
    private _router: Router,
    @Inject(APP_TEXT) public text: KT_JSON
  ) { }

  ngOnInit(): void { }

  onMenu(): void {
    this.eventEmitter.emit('toggle');
  }

  onLogo(): void {
    this._router.navigate(['']);
  }

  onLogin(): void { }

  onJoin(): void {
    this._router.navigate(['sign-up']);
  }

}
