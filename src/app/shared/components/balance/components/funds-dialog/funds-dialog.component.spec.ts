import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundsDialogComponent } from './funds-dialog.component';

describe('FundsDialogComponent', () => {
  let component: FundsDialogComponent;
  let fixture: ComponentFixture<FundsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
