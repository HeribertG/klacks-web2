import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from 'src/app/helpers/NgbDateParserFormatter';



import { AddressHistoryListComponent } from './address-edit/address-list/address-list.component';
import { NoteComponent } from './address-edit/note/note.component';
import { WorkshopComponent } from './address-edit/workshop/workshop.component';
import { MembershipComponent } from './address-edit/membership/membership.component';
import { AddressEditPersonaComponent } from './address-edit/address-edit-persona/address-edit-persona.component';
import { AddressEditHomeComponent } from './address-edit/address-edit-home/address-edit-home.component';
import { AddressNavComponent } from './all-address/all-address-nav/address-nav.component';
import { AddressListComponent } from './all-address/all-address-list/address-list.component';
import { AddressHomeComponent } from './all-address/all-address-home/address-home.component';
import { IconsModule } from 'src/app/icons/icons.module';
import { AddressEditNavComponent } from './address-edit/address-edit-nav/address-edit-nav.component';
import { TemplateModule } from 'src/app/template/template.module';
import { SpinnerModule } from 'src/app/spinner/spinner.module';
import { ToastModule } from 'src/app/toast/toast.module';
import { HistoryComponent } from './address-edit/history/history.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';









@NgModule({
  declarations: [
    AddressHomeComponent,
    AddressListComponent,
    AddressNavComponent,
    AddressEditHomeComponent,
    AddressEditPersonaComponent,
    MembershipComponent,
    WorkshopComponent,
    NoteComponent,
    AddressHistoryListComponent,
    AddressEditNavComponent,
    HistoryComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    IconsModule,
    TemplateModule,
    SpinnerModule,
    ToastModule,
    PdfViewerModule
  ],
  exports: [
    AddressHomeComponent,
    AddressListComponent,
    AddressNavComponent,
    AddressEditHomeComponent,
    AddressEditPersonaComponent,
    MembershipComponent,
    WorkshopComponent,
    NoteComponent,
    AddressHistoryListComponent,
    AddressEditNavComponent,

  ],
  providers: [

    { provide: LOCALE_ID, useValue: 'de-CH' },
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter },

  ],
})
export class AddressModule { }
