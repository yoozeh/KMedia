import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';

import { KJSON, APP_TEXT } from '../../modules/app-services/app-services.module';

interface MenuList {
  title: string;
  items: string[];
}

@Component({
  selector: 'k-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SidenavComponent implements OnInit {

  private _menu: Array<MenuList>;
  get menu(): Array<MenuList> { return this._menu; }

  constructor(
    @Inject(APP_TEXT) public text: KJSON
  ) {
    this._menu = [
      {
        title: "Menu Title 1",
        items: [
          'Menu1-1',
          'Menu1-2',
          'Menu1-3',
          'Menu1-4'
        ]
      },
      {
        title: "Menu Title 2",
        items: [
          'Menu2-1',
          'Menu2-2',
          'Menu2-3'
        ]
      },
      {
        title: "Menu Title 3",
        items: [
          'Menu3-1',
          'Menu3-2'
        ]
      }
    ];
  }

  ngOnInit() { }

}
