import { CurrencyPipe } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule, Title } from '@angular/platform-browser';
import { NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppErrorHandler } from './app.error-handler';
import { LoginComponent } from './auth/login/login.component';
import { DataManagementSwitchboardService } from './data/management/data-management-switchboard.service';
import { ErrorComponent } from './error/error.component';
import { CanDeactivateGuard } from './helpers/can-deactivate.guard';
import { AuthInterceptor, ResponseInterceptor } from './helpers/http-interceptor';
import { NgbDateCustomParserFormatter } from './helpers/NgbDateParserFormatter';
import { IconsModule } from './icons/icons.module';
import { SpinnerModule } from './spinner/spinner.module';
import { AsideComponent } from './surface/aside/aside.component';
import { FooterComponent } from './surface/footer/footer.component';
import { HeaderComponent } from './surface/header/header.component';
import { HomeComponent } from './surface/home/home.component';
import { MainComponent } from './surface/main/main.component';
import { NavComponent } from './surface/nav/nav.component';
import { TemplateModule } from './template/template.module';
import { ToastModule } from './toast/toast.module';



import { registerLocaleData } from '@angular/common';
import localeDECH from '@angular/common/locales/de-CH';



registerLocaleData(localeDECH);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavComponent,
    MainComponent,
    AsideComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    ErrorComponent,
   
 
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    IconsModule,
    TemplateModule,
    SpinnerModule,
    ToastModule,
 
  ],
  providers: [
    DataManagementSwitchboardService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor, multi: true },
    { provide: AppErrorHandler, useClass: AppErrorHandler },
    { provide: CanDeactivateGuard, useClass: CanDeactivateGuard },
    { provide: LOCALE_ID, useValue: 'de-CH' },
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter },
    CurrencyPipe,
    Title,

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
