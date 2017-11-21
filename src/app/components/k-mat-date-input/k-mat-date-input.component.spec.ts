import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KMatDateInputComponent } from './k-mat-date-input.component';

describe('KMatDateInputComponent', () => {
  let component: KMatDateInputComponent;
  let fixture: ComponentFixture<KMatDateInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KMatDateInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KMatDateInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
