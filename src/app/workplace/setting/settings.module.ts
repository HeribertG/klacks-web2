
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { IconsModule } from 'src/app/icons/icons.module';
import { TemplateModule } from 'src/app/template/template.module';
import { SpinnerModule } from 'src/app/spinner/spinner.module';
import { ToastModule } from 'src/app/toast/toast.module';

import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { SettingsHomeComponent } from './settings-home/settings-home.component';
import { SettingGeneralComponent } from './setting-general/setting-general.component';
import { SettingOwnerAddressComponent } from './setting-owner-address/setting-owner-address.component';
import { UserAdministrationComponent } from './user-administration/user-administration.component';
import { UserAdministrationRowComponent } from './user-administration/user-administration-row/user-administration-row.component';
import { UserAdministrationHeaderComponent } from './user-administration/user-administration-header/user-administration-header.component';
import { CountriesComponent } from './countries/countries.component';
import { CountriesHeaderComponent } from './countries/countries-header/countries-header.component';
import { CountriesRowComponent } from './countries/countries-row/countries-row.component';



@NgModule({
  declarations: [

    CountriesComponent,
    CountriesHeaderComponent,
    CountriesRowComponent,
    SettingGeneralComponent,
    SettingOwnerAddressComponent,
     UserAdministrationComponent,
    UserAdministrationHeaderComponent,
    UserAdministrationRowComponent,
    SettingsHomeComponent,


  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgbModule,
    IconsModule,
    TemplateModule,
    SpinnerModule,
    ToastModule,
    CodemirrorModule,
    PdfViewerModule
  

  ],
  exports: [

    CountriesComponent,
    CountriesHeaderComponent,
    CountriesRowComponent,

    SettingGeneralComponent,
    SettingOwnerAddressComponent,
    UserAdministrationComponent,
    UserAdministrationHeaderComponent,
    UserAdministrationRowComponent,
    SettingsHomeComponent,

  ],
  providers: [],

})
export class SettingsModule { }
