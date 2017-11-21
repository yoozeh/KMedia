import { Component, OnInit, OnDestroy, Input, ElementRef, Renderer2 } from '@angular/core';
import { FormControl, NgControl, ControlValueAccessor } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Subject } from 'rxjs';

export type KT_RADIO_ITEM = { text: string, value: string, width?: string };

@Component({
  selector: 'k-mat-radios',
  templateUrl: './k-mat-radios.component.html',
  styleUrls: ['./k-mat-radios.component.css'],
  providers: [{ provide: MatFormFieldControl, useExisting: KMatRadiosComponent }],
  host: {
    '[class.floating]': 'shouldPlaceholderFloat',
    '[id]': 'id',
    '[attr.aria-describedby]': 'describedBy'
  }
})
export class KMatRadiosComponent implements OnInit, OnDestroy, ControlValueAccessor, MatFormFieldControl<string> {

  private static _nextID: number = 0;

  //ControlValueAccessor
  writeValue(obj: any): void {

  }

  registerOnChange(fn: any): void {

  }

  registerOnTouched(fn: any): void {

  }

  //MatFormFieldControl
  private _controlType: string = 'k-mat-radios';
  private _describedBy: string = '';

  public ngControl: NgControl | null = null;
  public id: string = `${this._controlType}-${KMatRadiosComponent._nextID++}`;
  public focused: boolean = false;
  public errorState: boolean = false;
  public stateChanges: Subject<void> = new Subject<void>();

  get empty(): boolean {
    return this.formControl.value;
  }

  get shouldPlaceholderFloat(): boolean {
    return true;
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
      this.formControl.disable();
    } else {
      this.formControl.enable();
    }
  }

  @Input()
  get value(): string {
    return this.formControl.value;
  }
  set value(value: string) {
    this.formControl.setValue({ radioGroup: value });
    this.stateChanges.next();
  }

  setDescribedByIds(ids: string[]): void {
    this._describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent): void {
    if ((event.target as Element).tagName.toLowerCase() != 'input') {
      this._elementRef.nativeElement.querySelector('mat-radio-group').focus();
    }
  }

  //this
  @Input()
  items: Array<KT_RADIO_ITEM>;

  public formControl: FormControl;

  constructor(
    private _focusMonitor: FocusMonitor,
    private _elementRef: ElementRef,
    private _renderer: Renderer2
  ) {
    this.formControl = new FormControl('');
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.stateChanges.complete();
    this._focusMonitor.stopMonitoring(this._elementRef.nativeElement);
  }

}
