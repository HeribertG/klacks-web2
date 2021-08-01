import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDateCustomParserFormatter } from 'src/app/helpers/NgbDateParserFormatter';
import { NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastModule } from 'src/app/toast/toast.module';
import { SpinnerModule } from 'src/app/spinner/spinner.module';
import { TemplateModule } from 'src/app/template/template.module';
import { IconsModule } from 'src/app/icons/icons.module';
import { FormsModule } from '@angular/forms';

import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { InfoCardComponent } from './info-card/info-card.component';
import { ChangeListComponent } from './change-list/change-list.component';



@NgModule({
  declarations: [
    ChangeListComponent,
    InfoCardComponent,
    DashboardHomeComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    IconsModule,
    TemplateModule,
    SpinnerModule,
    ToastModule,
  ],
  exports: [
    ChangeListComponent,
    InfoCardComponent,
    DashboardHomeComponent,
  ],
  providers: [],
})
export class DashboardModule { }
