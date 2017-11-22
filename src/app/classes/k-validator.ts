import {
  AbstractControl,
  Validators,
  ValidatorFn
} from '@angular/forms';

export class KValidator {

  public static validateString(
    pattern: { [key: string]: RegExp | ((value: string) => boolean) }
  ): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      let result: any = null;
      let check: boolean;
      let error: { [key: string]: boolean };
      for (let key in pattern) {
        let value = pattern[key];
        if (value instanceof RegExp) {
          check = !value.test(control.value);
        } else {
          check = !value(control.value);
        }
        if (check) {
          error = { [key]: true };
          result = result ? { ...result, ...error } : error;
        }
      }
      return result;
    };
  }

}
