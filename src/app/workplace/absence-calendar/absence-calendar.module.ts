import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbsenceCalendarHomeComponent } from './absence-calendar-home/absence-calendar-home.component';
import { HScrollbarComponent } from './h-scrollbar/h-scrollbar.component';
import { VScrollbarComponent } from './v-scrollbar/v-scrollbar.component';
import { AbsenceContainerComponent } from './absence-container/absence-container.component';
import { ResizerVerticalDirective } from 'src/app/directive/resizer-vertical.directive';
import { ResizerHorizontalDirective } from 'src/app/directive/resizer-horizontal.directive';



@NgModule({
  declarations: [
    AbsenceCalendarHomeComponent,
    HScrollbarComponent,
    VScrollbarComponent,
    AbsenceContainerComponent,
    ResizerVerticalDirective,
    ResizerHorizontalDirective,
 
  ],
  imports: [
    CommonModule
  ]
})
export class AbsenceCalendarModule { }
