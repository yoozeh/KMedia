import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, Validators, ValidatorFn } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { debounceTime } from 'rxjs/operators';

import { KRegExp } from '../../../common/k-reg-exp';

import { KT_JSON, APP_TEXT } from '../../app.environments.service';
import { NetworkService } from '../../services/network.service';

import { KValidator } from '../../classes/k-validator';

import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'k-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  public step1: FormGroup;
  public step2: FormGroup;
  public step3: FormGroup;

  public isHidePassword: boolean = true;

  public gender: Array<any>;

  constructor(
    private _formBuilder: FormBuilder,
    private _dialog: MatDialog,
    private _network: NetworkService,
    @Inject(APP_TEXT) public text: KT_JSON
  ) {
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

  ngOnInit(): void {
    this.step2.controls.email.valueChanges
      .pipe(debounceTime(800))
      .subscribe((value) => {
        if (value.length > 0 && this.step2.controls.email.valid) {
          this._network.request('check-email', value).subscribe(
            (response) => {
              if (response.value) {
                this.step2.controls.email.setErrors({ 'already': true });
              }
            },
            (error) => { console.log(error) }
          );
        }
      });
    this.step3.controls.nickname.valueChanges
      .pipe(debounceTime(800))
      .subscribe((value) => {
        if (value.length > 0 && this.step3.controls.nickname.valid) {
          this._network.request('check-nickname', value).subscribe(
            (response) => {
              if (response.value) {
                this.step3.controls.nickname.setErrors({ 'already': true });
              }
            },
            (error) => { console.log(error) }
          );
        }
      });
  }

  private _validateConfirmPassword(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      let result: {} = null;
      if (this.step2) {
        if (this.step2.value.password !== control.value) {
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
        return !this.step1.value.checkTOS || !this.step1.value.checkPP;
      case 'password':
        switch (error) {
          case 'minlength':
            return this.step2.controls.password.hasError('minlength') ||
              this.step2.value.password.length === 0;
          case 'maxlength':
            return this.step2.controls.password.hasError('maxlength') ||
              this.step2.value.password.length === 0;
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
              this.step3.value.nickname.length === 0;
          case 'maxlength':
            return this.step3.controls.nickname.hasError('maxlength') ||
              this.step3.value.nickname.length === 0;
          case 'first':
            return this.step3.controls.nickname.hasError('first');
          case 'letter':
            return this.step3.controls.nickname.hasError('letter');
          case 'already':
            return this.step3.controls.nickname.hasError('already') ||
              this.step3.value.nickname.length === 0;
        }
        break;
    }
    return false;
  }

  public openTermsDialog(index: number): void {
    let title: string = '';
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
    if (this.step1.value.checkAll) {
      this.step1.controls.checkTOS.setValue(true);
      this.step1.controls.checkPP.setValue(true);
      this.step1.controls.checkUL.setValue(true);
    } else {
      this.step1.controls.checkTOS.setValue(false);
      this.step1.controls.checkPP.setValue(false);
      this.step1.controls.checkUL.setValue(false);
    }
  }

  public clickCheck(): void {
    this.step1.controls.checkAll.setValue(
      this.step1.value.checkTOS &&
      this.step1.value.checkPP &&
      this.step1.value.checkUL
    );
  }

}
