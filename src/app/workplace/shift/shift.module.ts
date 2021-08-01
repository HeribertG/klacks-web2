import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllShiftListComponent } from './all-shift/all-shift-list/all-shift-list.component';
import { AllShiftHomeComponent } from './all-shift/all-shift-home/all-shift-home.component';
import { AllShiftNavComponent } from './all-shift/all-shift-nav/all-shift-nav.component';
import { ShiftEditNavComponent } from './shift-edit/shift-edit-nav/shift-edit-nav.component';
import { ShiftEditComponent } from './shift-edit/shift-edit/shift-edit.component';



@NgModule({
  declarations: [

    AllShiftListComponent,
    AllShiftHomeComponent,
    AllShiftNavComponent,
    ShiftEditComponent,
    ShiftEditNavComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ShiftModule { }
