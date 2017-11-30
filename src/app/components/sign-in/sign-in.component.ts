import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UserService } from '../../services/user.service';
import { KT_JSON, APP_TEXT } from '../../app.environments.service';

import { KValidator } from '../../classes/k-validator';

import { KRegExp } from '../../../common/k-reg-exp';

@Component({
  selector: 'k-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  @Output()
  public eventEmitter: EventEmitter<any> = new EventEmitter();

  public account = {
    email: '',
    password: ''
  };

  private _disabled: boolean = false;
  get disabled(): boolean {
    return this._disabled;
  }

  private _failed: boolean = false;
  get failed(): boolean {
    return this._failed;
  }

  public formGroup: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    public user: UserService,
    @Inject(APP_TEXT) public text: KT_JSON
  ) {
    this.formGroup = this._formBuilder.group({
      email: ['', [
        Validators.required,
        KValidator.validateString({ 'invalid': KRegExp.checkEmail })
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(24)
      ]]
    }, );
  }

  public ngOnInit(): void { }

  public onSignIn(): void {
    if (this.formGroup.valid && !this.user.signed) {
      this._failed = false;
      this.disable();
      this.user.signIn(this.account.email, this.account.password).subscribe(
        (response) => {
          if (response.result || response.message === 'signed') {
            this._router.navigated = false;
            this._router.navigate([this._router.url]);
          } else if (!response.result && response.message === 'failed') {
            this._failed = true;
            this.enable();
          } else {
            this._router.navigate(['error']).then((value) => { });
          }
        },
        (error) => { console.log(error); }
      );
    }
  }

  public enable(): void {
    this._disabled = false;
    this.formGroup.enable();
    this.eventEmitter.emit({ enableClose: true });
  }

  public disable(): void {
    this._disabled = true;
    this.formGroup.disable();
    this.eventEmitter.emit({ enableClose: false });
  }

}
