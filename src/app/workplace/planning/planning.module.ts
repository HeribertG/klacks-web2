import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllPlanningComponent } from './all-planning/all-planning/all-planning.component';
import { AllPlanningNavComponent } from './all-planning/all-planning-nav/all-planning-nav.component';
import { PlanningEditComponent } from './planning-edit/planning-edit/planning-edit.component';
import { PlanningEditNavComponent } from './planning-edit/planning-edit-nav/planning-edit-nav.component';



@NgModule({
  declarations: [
    AllPlanningComponent,
    AllPlanningNavComponent,
    PlanningEditComponent,
    PlanningEditNavComponent
  ],
  imports: [
    CommonModule
  ]
})
export class PlanningModule { }
