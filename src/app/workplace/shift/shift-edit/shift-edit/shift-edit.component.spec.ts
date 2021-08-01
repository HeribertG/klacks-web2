import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftEditComponent } from './shift-edit.component';

describe('ShiftEditComponent', () => {
  let component: ShiftEditComponent;
  let fixture: ComponentFixture<ShiftEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShiftEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
