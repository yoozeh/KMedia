import { Component, OnInit, OnDestroy, Input, forwardRef } from '@angular/core';
import { FormControl, ControlValueAccessor, NgControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Subject } from 'rxjs';

export type KT_RADIO_ITEM = { text: string, value: string, width?: string };

@Component({
  selector: 'k-mat-radio-group',
  templateUrl: './k-mat-radio-group.component.html',
  styleUrls: ['./k-mat-radio-group.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => KMatRadioGroupComponent),
      multi: true
    },
    { provide: MatFormFieldControl, useExisting: KMatRadioGroupComponent }
  ],
  host: {
    '[id]': '_id',
    '[class.floating]': 'shouldPlaceholderFloat',
    '[attr.aria-describedby]': '_describedBy'
  }
})
export class KMatRadioGroupComponent implements OnInit, OnDestroy, ControlValueAccessor, MatFormFieldControl<string> {

  //ControlValueAccessor
  private _value: string = "";
  get value(): string {
    return this._value;
  }
  set value(value: string) {
    this._value = value;
    this._onChange(this.value);
    this.stateChanges.next();
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
    (isDisabled) ? this.formControl.disable() : this.formControl.enable();
  }

  //MatFormFieldControl
  private static _nextID: number = 0;
  private static _control: string = "k-mat-radio-group";

  private _stateChanges: Subject<void> = new Subject<void>();
  get stateChanges(): Subject<void> {
    return this._stateChanges;
  }

  private _id: string = `${KMatRadioGroupComponent._control}-${KMatRadioGroupComponent._nextID++}`;
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
    return this.formControl.value.empty;
  }

  get shouldPlaceholderFloat(): boolean {
    return true;
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

  private _controlType: string = KMatRadioGroupComponent._control;

  private _describedBy: string = '';
  public setDescribedByIds(ids: string[]): void {
    this._describedBy = ids.join('');
  }

  public onContainerClick(event: MouseEvent): void { }

  //this
  @Input('items')
  private _items: Array<KT_RADIO_ITEM> = [];
  get items(): Array<KT_RADIO_ITEM> {
    return this._items.slice();
  }

  public formControl: FormControl;

  constructor() {
    this.formControl = new FormControl('');
  }

  public ngOnInit(): void {
    this.formControl.valueChanges.subscribe((value) => {
      this.value = value;
    });
  }

  public ngOnDestroy(): void {
    this._stateChanges.complete();
  }

}
