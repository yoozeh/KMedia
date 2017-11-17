import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  AbstractControl,
  Validators,
  ValidatorFn
} from '@angular/forms';
import { MatDialog, MatSelect } from '@angular/material';

import { debounceTime } from 'rxjs/operators';

import { KJSON, APP_TEXT, NetworkService } from '../../modules/app-services/app-services.module';

import { DialogComponent } from '../dialog/dialog.component';

const patternLetter = /([A-Za-z])/;
const patternNumber = /([\d])/;
const patternSpecial = /([\`\~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\\\|\[\{\]\}\;\:\'\"\,\<\.\>\/\?])/;

const patternNicknameStart = /(^[a-zA-Z\d\_])/;
const patternNickname = /(^[a-zA-Z\d\_\.]+$)/;

@Component({
  selector: 'k-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SignUpComponent implements OnInit {

  public step1: FormGroup;
  public step2: FormGroup;
  public step3: FormGroup;

  public isHidePassword: boolean = true;

  constructor(
    @Inject(APP_TEXT) public text: KJSON,
    private _network: NetworkService,
    private _formBuilder: FormBuilder,
    private _dialog: MatDialog
  ) { }

  public ngOnInit(): void {
    this.step1 = this._formBuilder.group({
      checkAll: '',
      checkTOS: ['', Validators.required],
      checkPP: ['', Validators.required],
      checkUL: ''
    });
    this.step2 = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(24),
          this._validatePassword()
        ]
      ],
      confirm: ['',
        [
          Validators.required,
          this._validateConfirmPassword()
        ]
      ]
    });
    this.step3 = this._formBuilder.group({
      nickname: ['',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(16),
          this._validateNickname()
        ]
      ],
      name: '',
      gender: '',
      birthDate: ''
    });
    this.step2.controls.email.valueChanges
      .pipe(debounceTime(1000))
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
      .pipe(debounceTime(1000))
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

  private _validatePassword(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      let result: {} = null;
      if (!patternLetter.test(control.value)) {
        let value = { 'letter': true };
        result = result ? { ...result, ...value } : value;
      }
      if (!patternNumber.test(control.value)) {
        let value = { 'number': true };
        result = result ? { ...result, ...value } : value;
      }
      if (!patternSpecial.test(control.value)) {
        let value = { 'special': true };
        result = result ? { ...result, ...value } : value;
      }
      return result;
    };
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

  private _validateNickname(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      let result: {} = null;
      if (!patternNicknameStart.test(control.value)) {
        let value = { 'start': true };
        result = result ? { ...result, ...value } : value;
      }
      if (!patternNickname.test(control.value)) {
        let value = { 'letter': true };
        result = result ? { ...result, ...value } : value;
      }
      return result;
    };
  }

  public checkPassword(target: string): boolean {
    switch (target) {
      case 'minlength':
        return !(this.step2.controls.password.hasError('minlength') || this.step2.value.password.length === 0);
      case 'maxlength':
        return !(this.step2.controls.password.hasError('maxlength') || this.step2.value.password.length === 0);
      case 'letter':
        return !(this.step2.controls.password.hasError('letter'));
      case 'number':
        return !(this.step2.controls.password.hasError('number'));
      case 'special':
        return !(this.step2.controls.password.hasError('special'));
    }
    return true;
  }

  public checkNickname(target: string): boolean {
    switch (target) {
      case 'minlength':
        return !(this.step3.controls.nickname.hasError('minlength') || this.step3.value.nickname.length === 0);
      case 'maxlength':
        return !(this.step3.controls.nickname.hasError('maxlength') || this.step3.value.nickname.length === 0);
      case 'start':
        return !(this.step3.controls.nickname.hasError('start'));
      case 'letter':
        return !(this.step3.controls.nickname.hasError('letter'));
      case 'already':
        return !(this.step3.controls.nickname.hasError('already') || this.step3.value.nickname.length === 0);
    }
    return true;
  }

  public getErrorMessage(target: string): string {
    let control: any;
    let error: string;
    switch (target) {
      case 'email':
        control = this.step2.controls.email;
        if (control.hasError('required')) {
          error = this.text.require;
        } else if (control.hasError('email')) {
          error = this.text.email_error.valid;
        } else if (control.hasError('already')) {
          error = this.text.email_error.already;
        }
        break;
      case 'confirmPassword':
        control = this.step2.controls.confirm;
        if (control.hasError('required')) {
          error = this.text.require;
        } else if (control.hasError('confirm')) {
          error = this.text.confirm_password_error.confirm;
        } else if (control.hasError('password')) {
          error = this.text.confirm_password_error.password;
        }
        break;

    }
    return error;
  }

  public openStep1TermsDialog(index: number): void {
    this._dialog.open(DialogComponent, {
      data: {
        type: 'terms',
        index: index
      }
    });
  }

  public onStep1CheckAll(): void {
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

  public onStep1Check(): void {
    this.step1.controls.checkAll.setValue(
      this.step1.value.checkTOS &&
      this.step1.value.checkPP &&
      this.step1.value.checkUL
    );
  }

  public onSubmit(): void {
    alert('111');
  }

}
