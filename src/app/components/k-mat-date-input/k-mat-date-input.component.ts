import { Component, OnInit, OnDestroy, Input, forwardRef, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, ControlValueAccessor, NgControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { FocusMonitor } from '@angular/cdk/a11y';
import { Subject, Observable } from 'rxjs';
import { debounceTime, startWith, map } from 'rxjs/operators';

@Component({
  selector: 'k-mat-date-input',
  templateUrl: './k-mat-date-input.component.html',
  styleUrls: ['./k-mat-date-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => KMatDateInputComponent),
      multi: true
    },
    { provide: MatFormFieldControl, useExisting: KMatDateInputComponent }
  ],
  host: {
    '[id]': '_id',
    '[class.floating]': 'shouldPlaceholderFloat',
    '[attr.aria-describedby]': '_describedBy'
  }
})
export class KMatDateInputComponent implements OnInit, OnDestroy, ControlValueAccessor, MatFormFieldControl<string> {

  //ControlValueAccessor
  private _value: { year: string, month: string, day: string } = {
    year: '',
    month: '',
    day: ''
  }
  get value(): string {
    let result = this._value.year;
    result += '-' + (this._value.month.length === 1 ? '0' : '') + this._value.month;
    result += '-' + (this._value.day.length === 1 ? '0' : '') + this._value.day;
    return result;
  }
  set value(value: string) {
    let regExp = /[\d]{4}\-[\d]{1,2}\-[\d]{1,2}/;
    if (value && regExp.test(value)) {
      let split = value.split('-');
      let year = Number(split[0]);
      let month = Number(split[1]);
      let day = Number(split[2]);
      if (year < this._startYear || year > this._endYear) {
        return;
      }
      if (month < 1 || month > 12) {
        return;
      }
      let lastMonthDay = KMatDateInputComponent.getLastMonthDay(year, month);
      if (day < 1 || day > lastMonthDay) {
        return;
      }
      this._value = { year: split[0], month: split[1], day: split[2] };
      this.formGroup.controls.year.setValue(this._value.year);
      this.formGroup.controls.month.setValue(this._value.month);
      this.formGroup.controls.day.setValue(this._value.day);
      this._onChange(this.value);
      this.stateChanges.next();
    }
  }

  public writeValue(value: any) {
    if (value !== undefined) {
      this.value = value;
    }
  }

  private _onChange: (_: any) => void = (_: any) => { };
  public registerOnChange(fn: (_: any) => void): void {
    this._onChange = fn;
  }

  private _onTouched: any = {};
  public registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.formGroup.controls.year.disable();
      this.formGroup.controls.month.disable();
      this.formGroup.controls.day.disable();
    } else {
      this.formGroup.controls.year.enable();
      this.formGroup.controls.month.enable();
      this.formGroup.controls.day.enable();
    }
  }

  //MatFormFieldControl
  private static _nextID: number = 0;
  private static _control: string = "k-mat-date-input";

  private _stateChanges: Subject<void> = new Subject<void>();
  get stateChanges(): Subject<void> {
    return this._stateChanges;
  }

  private _id: string = `${KMatDateInputComponent._control}-${KMatDateInputComponent._nextID++}`;
  get id(): string {
    return this._id;
  }

  private _placeholder: string = '';
  @Input()
  get placeholder(): string {
    return this._placeholder;
  }
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }

  private _ngControl: NgControl | null = null;
  get ngControl(): NgControl | null {
    return this._ngControl;
  }

  private _focused: boolean = false;
  get focused(): boolean {
    return this._focused;
  }
  set focused(value: boolean) {
    this._focused = value;
  }

  get empty(): boolean {
    let value = this.formGroup.value;
    return !value.year || !value.month || !value.day;
  }

  get shouldPlaceholderFloat(): boolean {
    return this.focused || !this.empty;
  }

  private _required: boolean = false;
  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  private _disabled: boolean = false;
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this.setDisabledState(this._disabled);
    this.stateChanges.next();
  }

  get errorState(): boolean {
    return false;
  }

  private _controlType: string = KMatDateInputComponent._control;

  private _describedBy: string = '';
  public setDescribedByIds(ids: string[]): void {
    this._describedBy = ids.join('');
  }

  public onContainerClick(event: MouseEvent): void {
    if ((event.target as Element).tagName.toLowerCase() != 'input') {
      this._elementRef.nativeElement.querySelector('input').focus();
    }
  }

  //this
  private static _listMonth: Array<string> = Array.from(
    { length: 12 },
    (_, key) => (key + 1).toString()
  );
  private static _listDay: Array<string> = Array.from(
    { length: 31 },
    (_, key) => (key + 1).toString()
  );
  public static isLeapYear(year: number): boolean {
    return year % 4 == 0 && year % 100 != 0 || year % 400 == 0;
  }
  public static getLastMonthDay(year: number, month: number): number {
    if (year < 0 || year != parseInt(year.toString())) {
      return 0;
    }
    if (month < 1 || month > 12) {
      return 0;
    }
    let isLeapYear = KMatDateInputComponent.isLeapYear(year);
    let result = 31;
    switch (month) {
      case 2:
        result = isLeapYear ? 29 : 28;
        break;
      case 4:
      case 6:
      case 9:
      case 11:
        result = 30;
        break;
    }
    return result;
  }

  @Input('startyear')
  private _startYear: number = 1900;

  @Input('endyear')
  private _endYear: number = new Date().getFullYear();

  public formGroup: FormGroup;
  public filtered: { [key: string]: Observable<string[]> } = {
    year: null,
    month: null,
    day: null
  };
  private _listYear: Array<string>;
  private _prevLastDay: number = 0;
  private _prevValue = {
    year: '',
    month: '',
    day: ''
  }

  constructor(
    private _formBuilder: FormBuilder,
    private _elementRef: ElementRef,
    private _focusMonitor: FocusMonitor,
    private _renderer: Renderer2
  ) {
    this.formGroup = _formBuilder.group({
      'year': '',
      'month': '',
      'day': '',
    });
  }

  public ngOnInit(): void {
    this._focusMonitor.monitor(
      this._elementRef.nativeElement,
      this._renderer, true
    ).subscribe((origin) => {
      this.focused = !!origin;
      this.stateChanges.next();
    });
    this._listYear = Array.from(
      { length: this._endYear - this._startYear + 1 },
      (_, key) => (this._endYear - key).toString()
    );
    this._applyFilter();
    this.formGroup.controls.year.valueChanges.subscribe((value) => {
      this._value.year = value;
      this._onChange(this.value);
      this.stateChanges.next();
    });
    this.formGroup.controls.month.valueChanges.subscribe((value) => {
      this._value.month = value;
      this._onChange(this.value);
      this.stateChanges.next();
    });
    this.formGroup.controls.day.valueChanges.subscribe((value) => {
      this._value.day = value;
      this._onChange(this.value);
      this.stateChanges.next();
    });
  }

  public ngOnDestroy(): void {
    this.stateChanges.complete();
    this._focusMonitor.stopMonitoring(this._elementRef.nativeElement);
  }

  private _applyLastDay(): void {
    let year = Number(this.formGroup.controls.year.value);
    let month = Number(this.formGroup.controls.month.value);
    let lastMonthDay = KMatDateInputComponent.getLastMonthDay(year, month);
    let array = KMatDateInputComponent._listDay.slice(0, lastMonthDay - 31);
    if (this._prevLastDay !== array.length) {
      this._prevLastDay = array.length;
      this.filtered.day = this.formGroup.controls.day.valueChanges.pipe(
        debounceTime(200),
        startWith(null),
        map((value) => {
          return value ? this._filterString(value, array) : array.slice();
        })
      );
    }
  }

  private _applyFilter(): void {
    this.filtered.year = this.formGroup.controls.year.valueChanges.pipe(
      debounceTime(200),
      startWith(null),
      map((value) => {
        this._applyLastDay();
        return value ?
          this._filterString(value, this._listYear) :
          this._listYear.slice();
      })
    );
    this.filtered.month = this.formGroup.controls.month.valueChanges.pipe(
      debounceTime(200),
      startWith(null),
      map((value) => {
        this._applyLastDay();
        return value ?
          this._filterString(value, KMatDateInputComponent._listMonth) :
          KMatDateInputComponent._listMonth.slice();
      })
    );
    this._applyLastDay();
  }

  private _filterString(value: string, array: Array<string>): string[] {
    return array.filter((option) => {
      return option.toLowerCase().indexOf(value.toLowerCase()) === 0;
    });
  }

  public keyPressNumber(event: any) {
    const pattern = /[\d]/;
    if (!pattern.test(event.key)) {
      event.preventDefault();
    }
  }

}
