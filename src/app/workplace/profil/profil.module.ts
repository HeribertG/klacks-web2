import {  NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'src/app/toast/toast.module';
import { SpinnerModule } from 'src/app/spinner/spinner.module';
import { TemplateModule } from 'src/app/template/template.module';
import { IconsModule } from 'src/app/icons/icons.module';
import {  NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ProfilPictureComponent } from './profil-picture/profil-picture.component';
import { ProfilHomeComponent } from './profil-home/profil-home.component';
import { LoginDataEditComponent } from './login-data-edit/login-data-edit.component';




@NgModule({
  declarations: [
    ProfilHomeComponent,
    ProfilPictureComponent,
    LoginDataEditComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    FormsModule,
    NgbModule,
    IconsModule,
    TemplateModule,
    SpinnerModule,
    ToastModule,
  ],
  exports: [
    ProfilHomeComponent,
    ProfilPictureComponent,
    LoginDataEditComponent,

  ]
})
export class ProfilModule { }
