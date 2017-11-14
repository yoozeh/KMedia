import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { KJSON, APP_CONFIG, APP_TEXT } from '../../modules/app-services/app-services.module';

import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'k-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SignUpComponent implements OnInit {

  public signUpForm: FormGroup;
  public signUpStep1: FormGroup;
  public signUpStep2: FormGroup;
  public signUpStep3: FormGroup;
  public signUpStep4: FormGroup;

  constructor(
    @Inject(APP_CONFIG) private _configure: KJSON,
    @Inject(APP_TEXT) public text: KJSON,
    private _formBuilder: FormBuilder,
    private _dialog: MatDialog
  ) {
    this.signUpStep1 = _formBuilder.group({
      signUpStep1CheckAll: '',
      signUpStep1CheckTOS: ['', Validators.required],
      signUpStep1CheckPP: ['', Validators.required],
      signUpStep1CheckUL: ''
    });
    this.signUpForm = _formBuilder.group({
      signUpStep1: this.signUpStep1,
      signUpStep2: this.signUpStep2,
      signUpStep3: this.signUpStep3,
      signUpStep4: this.signUpStep4
    });
  }

  ngOnInit() { }

  openStep1TermsDialog(index: number): void {
    this._dialog.open(DialogComponent, {
      data: {
        type: 'terms',
        index: index
      }
    });
  }

  onStep1CheckAll(): void {
    if (this.signUpStep1.value.signUpStep1CheckAll) {
      this.signUpStep1.controls.signUpStep1CheckTOS.setValue(true);
      this.signUpStep1.controls.signUpStep1CheckPP.setValue(true);
      this.signUpStep1.controls.signUpStep1CheckUL.setValue(true);
    } else {
      this.signUpStep1.controls.signUpStep1CheckTOS.setValue(false);
      this.signUpStep1.controls.signUpStep1CheckPP.setValue(false);
      this.signUpStep1.controls.signUpStep1CheckUL.setValue(false);
    }
  }

  onStep1Check(): void {
    this.signUpStep1.controls.signUpStep1CheckAll.setValue(
      this.signUpStep1.value.checkTOS &&
      this.signUpStep1.value.signUpStep1CheckPP &&
      this.signUpStep1.value.signUpStep1CheckUL
    );
  }

  onSubmit(): void {
    alert('111');
  }

}
