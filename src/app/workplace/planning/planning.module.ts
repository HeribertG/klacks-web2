import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllPlanningComponent } from './all-planning/all-planning/all-planning.component';
import { AllPlanningNavComponent } from './all-planning/all-planning-nav/all-planning-nav.component';



@NgModule({
  declarations: [
    AllPlanningComponent,
    AllPlanningNavComponent
  ],
  imports: [
    CommonModule
  ]
})
export class PlanningModule { }
