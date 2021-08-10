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
import { ResizeObserverDirective } from 'src/app/directive/resize-observer.directive';
import { AbsenceRowHeaderComponent } from './absence-row-header/absence-row-header.component';
import { TemplateModule } from 'src/app/template/template.module';
import { NgxSliderModule } from '@angular-slider/ngx-slider';


@NgModule({
  declarations: [
    AbsenceCalendarHomeComponent,
    CalHScrollbarComponent,
    CalVScrollbarComponent,
    AbsenceContainerComponent,
    ResizerVerticalDirective,
    ResizerHorizontalDirective,
    ResizeObserverDirective,
    AbsenceBodyContainerComponent,
    AbsenceBodyComponent,
    AbsenceRowHeaderComponent,
 
  ],
  imports: [
    CommonModule,
    TemplateModule,
    NgxSliderModule

  ],
  exports: [
    AbsenceCalendarHomeComponent,
    CalHScrollbarComponent,
    CalVScrollbarComponent,
    AbsenceContainerComponent,
    ResizerVerticalDirective,
    ResizerHorizontalDirective,
    ResizeObserverDirective,
    AbsenceBodyContainerComponent,
    AbsenceBodyComponent,
  ]
})
export class AbsenceCalendarModule { }
