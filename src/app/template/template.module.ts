import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IconsModule } from '../icons/icons.module';


import { ButtonNewComponent } from './button-new/button-new.component';
import { ButtonPdfComponent } from './button-pdf/button-pdf.component';
import { DeletewindowComponent } from './deletewindow/deletewindow.component';
import { DragDropFileUploadDirective } from './directives/drag-drop-file-upload.directive';
import { ButtonSettingComponent } from './button-setting/button-setting.component';
import { RestorewindowComponent } from './restorewindow/restorewindow.component';




@NgModule({
  declarations: [
    ButtonNewComponent,
    ButtonPdfComponent,
    DeletewindowComponent,
    DragDropFileUploadDirective,
    ButtonSettingComponent,
    RestorewindowComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    IconsModule,
  ],
  exports: [
    ButtonNewComponent,
    ButtonPdfComponent,
    DeletewindowComponent,
    DragDropFileUploadDirective,
    ButtonSettingComponent,
    RestorewindowComponent,

    
  ]
})
export class TemplateModule { }
