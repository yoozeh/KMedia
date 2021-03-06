import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, Validators, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog, MatVerticalStepper } from '@angular/material';
import { debounceTime } from 'rxjs/operators';

import { NetworkService } from '../../services/network.service';
import { UserService } from '../../services/user.service';
import { KT_JSON, APP_TEXT } from '../../app.environments.service';

import { KValidator } from '../../classes/k-validator';
import { DialogComponent } from '../dialog/dialog.component';

import { KRegExp } from '../../../common/k-reg-exp';
import { KUser } from '../../../common/k-user';

@Component({
  selector: 'k-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  private _index: number = 1;
  get index(): number {
    return this._index;
  }

  public step1: FormGroup;
  public step2: FormGroup;
  public step3: FormGroup;

  public agreement = {
    termsOfService: false,
    privacyPolicy: false,
    userLocation: false
  };

  public account = {
    email: '',
    password: '',
    nickname: ''
  };

  public personal = {
    name: '',
    birth: '',
    gender: ''
  };

  public isHidePassword: boolean = true;
  public gender: Array<any>;
  public loadingHeight: number = 0;

  constructor(
    private _formBuilder: FormBuilder,
    private _elementRef: ElementRef,
    private _router: Router,
    private _dialog: MatDialog,
    private _user: UserService,
    private _network: NetworkService,
    @Inject(APP_TEXT) public text: KT_JSON
  ) {
    if (this._user.signed) {
      this._router.navigate(['redirect']);
    }
    this.step1 = this._formBuilder.group({
      checkAll: '',
      checkTOS: ['', Validators.required],
      checkPP: ['', Validators.required],
      checkUL: ''
    });
    this.step2 = this._formBuilder.group({
      email: ['', [
        Validators.required,
        KValidator.validateString({ 'invalid': KRegExp.checkEmail })
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(24),
        KValidator.validateString({
          'alphabet': KRegExp.passwordAlphabet,
          'number': KRegExp.passwordNumber,
          'special': KRegExp.passwordSpecial
        })
      ]],
      confirm: ['', [
        Validators.required,
        this._validateConfirmPassword()
      ]]
    });
    this.step3 = this._formBuilder.group({
      nickname: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(16),
        KValidator.validateString({
          'first': KRegExp.nicknameFirst,
          'letter': KRegExp.nicknameLetter
        })
      ]],
      name: '',
      gender: '',
      birthDate: '',
    });
    this.gender = [
      { text: this.text.male, value: 'male' },
      { text: this.text.female, value: 'female' }
    ];
  }

  public ngOnInit(): void {
    this.step2.controls.password.valueChanges.subscribe((value) => {
      if (this.step2.controls.confirm.dirty) {
        this.step2.controls.confirm.updateValueAndValidity();
      }
    });
    this.step2.controls.email.valueChanges.pipe(
      debounceTime(800)
    ).subscribe((value) => {
      if (value.length > 0 && this.step2.controls.email.valid) {
        this._network.request('check-email', value).subscribe(
          (response) => {
            if (response.result) {
              this.step2.controls.email.setErrors({ 'already': true });
            }
          },
          (error) => { console.log(error); }
        );
      }
    });
    this.step3.controls.nickname.valueChanges.pipe(
      debounceTime(800)
    ).subscribe((value) => {
      if (value.length > 0 && this.step3.controls.nickname.valid) {
        this._network.request('check-nickname', value).subscribe(
          (response) => {
            if (response.result) {
              this.step3.controls.nickname.setErrors({ 'already': true });
            }
          },
          (error) => { console.log(error); }
        );
      }
    });
  }

  private _validateConfirmPassword(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      let result: any = null;
      if (this.step2) {
        if (this.account.password !== control.value) {
          let value = { 'confirm': true };
          result = result ? { ...result, ...value } : value;
        }
        if (this.step2.controls.password.invalid) {
          let value = { 'password': true };
          result = result ? { ...result, ...value } : value;
        }
      }
      return result;
    };
  }

  public checkError(name: string, error?: string): boolean {
    switch (name.toLowerCase()) {
      case 'agreement':
        return !this.agreement.termsOfService || !this.agreement.privacyPolicy;
      case 'password':
        switch (error) {
          case 'minlength':
            return this.step2.controls.password.hasError('minlength') ||
              this.account.password.length === 0;
          case 'maxlength':
            return this.step2.controls.password.hasError('maxlength') ||
              this.account.password.length === 0;
          case 'alphabet':
            return this.step2.controls.password.hasError('alphabet');
          case 'number':
            return this.step2.controls.password.hasError('number');
          case 'special':
            return this.step2.controls.password.hasError('special');
        }
      case 'nickname':
        switch (error) {
          case 'minlength':
            return this.step3.controls.nickname.hasError('minlength') ||
              this.account.nickname.length === 0;
          case 'maxlength':
            return this.step3.controls.nickname.hasError('maxlength') ||
              this.account.nickname.length === 0;
          case 'first':
            return this.step3.controls.nickname.hasError('first');
          case 'letter':
            return this.step3.controls.nickname.hasError('letter');
          case 'already':
            return this.step3.controls.nickname.hasError('already') ||
              this.account.nickname.length === 0;
        }
        break;
    }
    return false;
  }

  public openTermsDialog(index: number): void {
    let title = '';
    switch (index) {
      case 1:
        title = this.text.terms_of_service;
        break;
      case 2:
        title = this.text.privacy_policy;
        break;
      case 3:
        title = this.text.user_location;
        break;
    }
    this._dialog.open(DialogComponent, {
      data: { title: title, type: 'terms', index: index }
    });
  }

  public clickCheckAll(): void {
    this.agreement.termsOfService = this.step1.value.checkAll;
    this.agreement.privacyPolicy = this.step1.value.checkAll;
    this.agreement.userLocation = this.step1.value.checkAll;
  }

  public clickCheck(): void {
    this.step1.controls.checkAll.setValue(
      this.agreement.termsOfService &&
      this.agreement.privacyPolicy &&
      this.agreement.userLocation
    );
  }

  public submit(): void {
    if (this.step1.valid && this.step2.valid && this.step3.valid) {
      this.loadingHeight = this._elementRef.nativeElement.querySelector('mat-vertical-stepper').offsetHeight;
      this._index = 0;
      let personal: {} = null;
      if (this.personal.name) {
        personal = { ...personal, name: this.personal.name };
      }
      if (this.personal.birth) {
        personal = { ...personal, birth: new Date(this.personal.birth) };
      }
      if (this.personal.gender) {
        if (this.personal.gender === 'male') {
          personal = { ...personal, gender: 1 };
        } else if (this.personal.gender === 'female') {
          personal = { ...personal, gender: -1 };
        }
      }
      let data: any = null;
      if (personal) {
        data = {
          account: this.account,
          personal: personal,
          fields: { agreement: this.agreement }
        };
      } else {
        data = {
          account: this.account,
          fields: { agreement: this.agreement }
        };
      }
      let user = new KUser(data);
      this._network.request('sign-up', user.toJSON()).subscribe(
        (response) => {
          if (response.result) {
            this._index = 2;
          } else {
            this._index = 3;
          }
        },
        (error) => { console.log(error); }
      );
    }
  }

}
