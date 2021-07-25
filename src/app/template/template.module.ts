import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IconsModule } from '../icons/icons.module';


import { ButtonExcelComponent } from './button-excel/button-excel.component';
// tslint:disable-next-line: max-line-length
import { ButtonExcelTransparentBackgroundComponent } from './button-excel-transparent-background/button-excel-transparent-background.component';
import { ButtonNewComponent } from './button-new/button-new.component';
import { ButtonPdfComponent } from './button-pdf/button-pdf.component';
import { DeletewindowComponent } from './deletewindow/deletewindow.component';
import { DragDropFileUploadDirective } from './directives/drag-drop-file-upload.directive';
import { MonetaryTemplateComponent } from './monetary/monetary.component';
import { CreditsListComponent } from './credits-list/credits-list.component';
import { ButtonSettingComponent } from './button-setting/button-setting.component';
import { RestorewindowComponent } from './restorewindow/restorewindow.component';
import { ResizeObserverDirective } from './directives/resize-observer.directive';



@NgModule({
  declarations: [
    ButtonExcelComponent,
    ButtonExcelTransparentBackgroundComponent,
    ButtonNewComponent,
    ButtonPdfComponent,
    DeletewindowComponent,
    DragDropFileUploadDirective,
    MonetaryTemplateComponent,
    CreditsListComponent,
    ButtonSettingComponent,
    RestorewindowComponent,
    ResizeObserverDirective,

  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    IconsModule,
  ],
  exports: [
    ButtonExcelComponent,
    ButtonExcelTransparentBackgroundComponent,
    ButtonNewComponent,
    ButtonPdfComponent,
    DeletewindowComponent,
    DragDropFileUploadDirective,
    MonetaryTemplateComponent,
    CreditsListComponent,
    ButtonSettingComponent,
    RestorewindowComponent,
    ResizeObserverDirective,
  ]
})
export class TemplateModule { }
