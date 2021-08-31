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
import { AbsenceCalendarDirective } from './directives/absence-calendar.directive';
import { AbsenceReasonComponent } from './absence-reason/absence-reason.component';
import { IconsModule } from 'src/app/icons/icons.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';

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
    AbsenceCalendarDirective,
    AbsenceReasonComponent,
 
  ],
  imports: [
    CommonModule,
    FormsModule,
    TemplateModule,
    NgxSliderModule,
    IconsModule,
    NgbModule,
    DragDropModule,

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
