import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'k-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  public status: any = {
    enableClose: true
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  public ngOnInit(): void { }

  public onChild(event: any): void {
    if (typeof event.enableClose === 'boolean') {
      this.status.enableClose = event.enableClose;
    }
  }

}
