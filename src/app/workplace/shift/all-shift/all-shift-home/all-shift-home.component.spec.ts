import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllShiftHomeComponent } from './all-shift-home.component';

describe('AllShiftHomeComponent', () => {
  let component: AllShiftHomeComponent;
  let fixture: ComponentFixture<AllShiftHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllShiftHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllShiftHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
