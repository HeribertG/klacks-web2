import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbsenceCalendarHomeComponent } from './absence-calendar-home/absence-calendar-home.component';
import { CalHScrollbarComponent } from './h-scrollbar/h-scrollbar.component';
import { CalVScrollbarComponent } from './v-scrollbar/v-scrollbar.component';
import { AbsenceContainerComponent } from './absence-container/absence-container.component';
import { ResizerVerticalDirective } from 'src/app/directive/resizer-vertical.directive';
import { ResizerHorizontalDirective } from 'src/app/directive/resizer-horizontal.directive';
import { AbsenceBodyContainerComponent } from './absence-body-container/absence-body-container.component';
import { AbsenceBodyComponent } from './absence-body/absence-body.component';



@NgModule({
  declarations: [
    AbsenceCalendarHomeComponent,
    CalHScrollbarComponent,
    CalVScrollbarComponent,
    AbsenceContainerComponent,
    ResizerVerticalDirective,
    ResizerHorizontalDirective,
    AbsenceBodyContainerComponent,
    AbsenceBodyComponent,
 
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AbsenceCalendarHomeComponent,
    CalHScrollbarComponent,
    CalVScrollbarComponent,
    AbsenceContainerComponent,
    ResizerVerticalDirective,
    ResizerHorizontalDirective,
    AbsenceBodyContainerComponent,
    AbsenceBodyComponent,
  ]
})
export class AbsenceCalendarModule { }