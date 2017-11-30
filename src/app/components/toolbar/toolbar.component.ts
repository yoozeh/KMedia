import { Component, OnInit, Inject, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { UserService } from '../../services/user.service';
import { KT_JSON, APP_TEXT } from '../../app.environments.service';

import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'k-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  @Output()
  public eventEmitter: EventEmitter<any> = new EventEmitter();

  constructor(
    private _router: Router,
    private _dialog: MatDialog,
    public user: UserService,
    @Inject(APP_TEXT) public text: KT_JSON
  ) { }

  public ngOnInit(): void { }

  public onMenu(): void {
    this.eventEmitter.emit('toggle');
  }

  public onLogo(): void {
    this._router.navigate(['']);
  }

  public onSignIn(): void {
    let dialog = this._dialog.open(DialogComponent, {
      panelClass: 'sign-in-container',
      disableClose: true,
      width: '320px',
      position: { top: '72px', right: '8px' },
      data: { type: 'sign-in' }
    });
    dialog.backdropClick().subscribe(
      (value) => {
        if (dialog.componentInstance.status.enableClose) {
          dialog.close();
        }
      },
      (error) => {
        console.log(error);
      },
      () => { }
    );
  }

  public onSignOut(): void {
    this.user.signOut().subscribe(
      (value) => {
        console.log(1);
        window.location.href = '/';
        window.location.reload();
      },
      (error) => {
        console.log(error);
      },
      () => { }
    );
  }

}
