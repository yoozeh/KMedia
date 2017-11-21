import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KMatNoticeTextComponent } from './k-mat-notice-text.component';

describe('KMatNoticeTextComponent', () => {
  let component: KMatNoticeTextComponent;
  let fixture: ComponentFixture<KMatNoticeTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KMatNoticeTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KMatNoticeTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
