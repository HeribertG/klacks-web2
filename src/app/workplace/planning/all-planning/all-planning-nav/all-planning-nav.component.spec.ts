import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPlanningNavComponent } from './all-planning-nav.component';

describe('AllPlanningNavComponent', () => {
  let component: AllPlanningNavComponent;
  let fixture: ComponentFixture<AllPlanningNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllPlanningNavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllPlanningNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
