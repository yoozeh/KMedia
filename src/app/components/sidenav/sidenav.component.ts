import { Component, OnInit, Inject } from '@angular/core';

import { KT_JSON, APP_TEXT } from '../../app.environments.service';

export type KT_MENU_LIST = {
  title: string;
  items: string[];
};

@Component({
  selector: 'k-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  private _menu: Array<KT_MENU_LIST>;
  get menu(): Array<KT_MENU_LIST> {
    return this._menu;
  }

  constructor(
    @Inject(APP_TEXT) public text: KT_JSON
  ) { }

  public ngOnInit(): void {
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

}
