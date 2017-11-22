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

  public ngOnInit(): void { }

  public onMenu(): void {
    this.eventEmitter.emit('toggle');
  }

  public onLogo(): void {
    this._router.navigate(['']);
  }

}
