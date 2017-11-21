import { Component, OnInit, OnDestroy, Input, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Subject, Observable } from 'rxjs';
import { debounceTime, startWith, map } from 'rxjs/operators';

export type KT_DATE_VALUE = { year: string, month: string, day: string };

@Component({
  selector: 'k-mat-date-input',
  templateUrl: './k-mat-date-input.component.html',
  styleUrls: ['./k-mat-date-input.component.css'],
  providers: [{ provide: MatFormFieldControl, useExisting: KMatDateInputComponent }],
  host: {
    '[class.floating]': 'shouldPlaceholderFloat',
    '[id]': 'id',
    '[attr.aria-describedby]': 'describedBy'
  }
})
export class KMatDateInputComponent implements OnInit, OnDestroy, MatFormFieldControl<KT_DATE_VALUE> {

  private static _listMonth: Array<string> = Array.from(
    { length: 12 },
    (_, key) => (key + 1).toString()
  );
  private static _listDay: Array<string> = Array.from(
    { length: 31 },
    (_, key) => (key + 1).toString()
  );
  public static isLeapYear(year: number): boolean {
    year = parseInt(year.toString());
    return year % 4 == 0 && year % 100 != 0 || year % 400 == 0;
  }

  private static _nextID: number = 0;

  private _controlType: string = 'k-mat-birth-date';
  private _describedBy: string = '';

  public ngControl: NgControl | null = null;
  public id: string = `${this._controlType}-${KMatDateInputComponent._nextID++}`;
  public focused: boolean = false;
  public errorState: boolean = false;
  public stateChanges: Subject<void> = new Subject<void>();

  get empty(): boolean {
    let value: any = this.formGroup.value;
    return !value.year && !value.month && !value.day;
  }

  get shouldPlaceholderFloat(): boolean {
    return this.focused || !this.empty;
  }

  private _placeholder: string;
  @Input()
  get placeholder(): string {
    return this._placeholder;
  }
  set placeholder(placeholder: string) {
    this._placeholder = placeholder;
    this.stateChanges.next();
  }

  private _required: boolean = false;
  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(required: boolean) {
    this._required = coerceBooleanProperty(required);
    this.stateChanges.next();
  }

  private _disabled: boolean = false;
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(disabled: boolean) {
    this._disabled = coerceBooleanProperty(disabled);
    this.stateChanges.next();
    if (this._disabled) {
      this.formGroup.controls.year.disable();
      this.formGroup.controls.month.disable();
      this.formGroup.controls.day.disable();
    } else {
      this.formGroup.controls.year.enable();
      this.formGroup.controls.month.enable();
      this.formGroup.controls.day.enable();
    }
  }

  @Input()
  get value(): KT_DATE_VALUE | null {
    let value = this.formGroup.value;
    if (value.year.length === 4 &&
      value.month.length > 0 && value.month.length <= 2 &&
      value.day.length > 0 && value.day.length <= 2) {
      return { year: value.year, month: value.month, day: value.day };
    }
    return null;
  }
  set value(value: KT_DATE_VALUE | null) {
    value = value || { year: '', month: '', day: '' };
    this.formGroup.setValue({
      year: value.year,
      month: value.month,
      day: value.day
    });
    this.stateChanges.next();
  }

  public formGroup: FormGroup;
  public filtered: { [key: string]: Observable<string[]> } = {
    year: null,
    month: null,
    day: null
  };

  @Input()
  public startyear: number = 1900;

  @Input()
  public endyear: number = new Date().getFullYear();

  private _listYear: Array<string>;
  private _prevLastDay: number = 0;

  constructor(
    private _formBuilder: FormBuilder,
    private _focusMonitor: FocusMonitor,
    private _elementRef: ElementRef,
    private _renderer: Renderer2
  ) {
    this.formGroup = _formBuilder.group({ 'year': '', 'month': '', 'day': '', });
  }

  ngOnInit(): void {
    this._focusMonitor.monitor(this._elementRef.nativeElement, this._renderer, true)
      .subscribe((origin) => {
        this.focused = !!origin;
        this.stateChanges.next();
      });
    this._listYear = Array.from(
      { length: this.endyear - this.startyear + 1 },
      (_, key) => (this.endyear - key).toString()
    );
    this._applyFilter();
  }

  ngOnDestroy(): void {
    this.stateChanges.complete();
    this._focusMonitor.stopMonitoring(this._elementRef.nativeElement);
  }

  setDescribedByIds(ids: string[]): void {
    this._describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent): void {
    if ((event.target as Element).tagName.toLowerCase() != 'input') {
      this._elementRef.nativeElement.querySelector('input').focus();
    }
  }

  private _applyLastDay(): void {
    let year: number = Number(this.formGroup.controls.year.value);
    let month: number = Number(this.formGroup.controls.month.value);
    let isLeapYear: boolean = KMatDateInputComponent.isLeapYear(Number(year));
    let array: Array<string>;
    switch (month) {
      case 2:
        if (isLeapYear) {
          array = KMatDateInputComponent._listDay.slice(0, -2);
        } else {
          array = KMatDateInputComponent._listDay.slice(0, -3);
        }
        break;
      case 4:
      case 6:
      case 9:
      case 11:
        array = KMatDateInputComponent._listDay.slice(0, -1);
        break;
      default:
        array = KMatDateInputComponent._listDay;
        break;
    }
    if (this._prevLastDay !== array.length) {
      this._prevLastDay = array.length;
      this.filtered.day = this.formGroup.controls.day.valueChanges
        .pipe(debounceTime(200), startWith(null), map((value) => {
          return value ? this._filterString(value, array) : array.slice();
        }));
    }
  }

  private _applyFilter(): void {
    this.filtered.year = this.formGroup.controls.year.valueChanges
      .pipe(debounceTime(200), startWith(null), map((value) => {
        this._applyLastDay();
        return value ?
          this._filterString(value, this._listYear) :
          this._listYear.slice();
      }))
    this.filtered.month = this.formGroup.controls.month.valueChanges
      .pipe(debounceTime(200), startWith(null), map((value) => {
        this._applyLastDay();
        return value ?
          this._filterString(value, KMatDateInputComponent._listMonth) :
          KMatDateInputComponent._listMonth.slice();
      }));
    this._applyLastDay();
  }

  private _filterString(value: string, array: Array<string>): string[] {
    return array.filter((option) => {
      return option.toLowerCase().indexOf(value.toLowerCase()) === 0;
    });
  }

}
