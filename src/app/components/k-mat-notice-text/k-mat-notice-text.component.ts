import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'k-mat-notice-text',
  templateUrl: './k-mat-notice-text.component.html',
  styleUrls: ['./k-mat-notice-text.component.css']
})
export class KMatNoticeTextComponent implements OnInit {

  @Input()
  public size: number = 1;

  @Input()
  public status: string = 'success';

  @Input()
  public text: string = '';

  get icon(): string {
    switch (this.status) {
      case 'success':
        return 'done'
      case 'danger':
        return 'block'
    }
    return null;
  }

  constructor() { }

  ngOnInit(): void { }

}
