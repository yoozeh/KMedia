import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'k-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.css']
})
export class RedirectComponent implements OnInit {

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {
    let target = this._activatedRoute.snapshot.paramMap.get('component');
    if (target) {
      this._router.navigate([target]);
    } else {
      this._router.navigate(['/']);
    }
  }

  ngOnInit() { }

}
