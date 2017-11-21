import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KMatRadiosComponent } from './k-mat-radios.component';

describe('KMatRadiosComponent', () => {
  let component: KMatRadiosComponent;
  let fixture: ComponentFixture<KMatRadiosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KMatRadiosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KMatRadiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
