import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftEditNavComponent } from './shift-edit-nav.component';

describe('ShiftEditNavComponent', () => {
  let component: ShiftEditNavComponent;
  let fixture: ComponentFixture<ShiftEditNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShiftEditNavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftEditNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
