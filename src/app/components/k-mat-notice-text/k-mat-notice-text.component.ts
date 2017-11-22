import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'k-mat-notice-text',
  templateUrl: './k-mat-notice-text.component.html',
  styleUrls: ['./k-mat-notice-text.component.css']
})
export class KMatNoticeTextComponent implements OnInit {

  @Input('status')
  private _status: string = 'success';
  get status(): string {
    return this._status;
  }

  @Input('size')
  private _size: number = 1;
  get size(): number {
    return this._size;
  }

  get icon(): string {
    switch (this._status) {
      case 'success':
        return 'done'
      case 'danger':
        return 'block'
    }
    return null;
  }

  constructor() { }

  public ngOnInit(): void { }

}
