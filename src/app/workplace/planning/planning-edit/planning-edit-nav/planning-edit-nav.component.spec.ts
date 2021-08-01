import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningEditNavComponent } from './planning-edit-nav.component';

describe('PlanningEditNavComponent', () => {
  let component: PlanningEditNavComponent;
  let fixture: ComponentFixture<PlanningEditNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanningEditNavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanningEditNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
