import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EarningsDialogComponent } from './earnings-dialog.component';

describe('EarningsDialogComponent', () => {
  let component: EarningsDialogComponent;
  let fixture: ComponentFixture<EarningsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EarningsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EarningsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
