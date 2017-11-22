import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KMatRadioGroupComponent } from './k-mat-radio-group.component';

describe('KMatRadioGroupComponent', () => {
  let component: KMatRadioGroupComponent;
  let fixture: ComponentFixture<KMatRadioGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KMatRadioGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KMatRadioGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
