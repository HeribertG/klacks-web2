import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewContainerRef,
  ViewChild,
  ComponentFactoryResolver,
  Injector,
  OnChanges,
} from '@angular/core';
import { DocumentsHomeComponent } from 'src/app/workplace/document/all-documents/documents-home/documents-home.component';
import { AllInvoicesHomeComponent } from 'src/app/workplace/invoice/all-invoices/all-invoices-home/all-invoices-home.component';
import { InvoicesHomeComponent } from 'src/app/workplace/invoice/edit-invoices/invoices-home/invoices-home.component';
import { ProfilHomeComponent } from 'src/app/workplace/profil/profil-home/profil-home.component';
import { ReminderHomeComponent } from 'src/app/workplace/reminder/reminder-home/reminder-home.component';
import { SettingsHomeComponent } from 'src/app/workplace/setting/settings-home/settings-home.component';
import { WorkshopsHomeComponent } from 'src/app/workplace/workshop/all-workshops/workshops-home/workshops-home.component';
import { EditWorkshopHomeComponent } from 'src/app/workplace/workshop/edit-workshop/edit-workshop-home/edit-workshop-home.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnChanges {
  @ViewChild('LazyLoadingPlaceholder', { read: ViewContainerRef, static: true })

  viewContainer: ViewContainerRef;

  @Input() isDashboard: boolean;
  @Input() isAllAddsresses: boolean;
  @Input() isAllWorkshops: boolean;
  @Input() isAllDocuments: boolean;
  @Input() isAllInvoices: boolean;
  @Input() isInvoices: boolean;
  @Input() isProfile: boolean;
  @Input() isSetting: boolean;
  @Input() isReminder: boolean;
  @Input() isAllExports: boolean;


  @Input() isEditAddress: boolean;
  @Input() isEditWorkshop: boolean;
  @Input() isEditExport: boolean;

  @Output() isChangingEvent = new EventEmitter<boolean>();
  @Output() isEnterEvent = new EventEmitter();

  compInstanceSettingHome: SettingsHomeComponent;
  compInstanceProfilHome: ProfilHomeComponent;
  compInstanceReminderHome: ReminderHomeComponent;
  compInstanceWorkshopsHome: WorkshopsHomeComponent;
  compInstanceEditWorkshopHome: EditWorkshopHomeComponent;
  compInstanceDocumentsHome: DocumentsHomeComponent;
  compInstanceAllInvoicesHome: AllInvoicesHomeComponent;
  compInstanceInvoicesHome: InvoicesHomeComponent;

  constructor(
    private injector: Injector,
    private cfr: ComponentFactoryResolver
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes) {


    if (this.isSetting && !this.compInstanceSettingHome) {
      import('./../../workplace/setting/settings-home/settings-home.component').then(m => {
        const comp = m.SettingsHomeComponent;


        const factory =
          this.cfr.resolveComponentFactory(comp);

        const compRef = this.viewContainer.createComponent(
          factory, null, this.injector);

        this.compInstanceSettingHome = compRef.instance;
        this.compInstanceSettingHome.isSetting = this.isSetting;

        compRef.instance.isChangingEvent.subscribe(event => {
          this.isChangingEvent.emit(event);
        });


      });
    }

    if (this.isProfile && !this.compInstanceProfilHome) {
      import('./../../workplace/profil/profil-home/profil-home.component').then(m => {
        const comp = m.ProfilHomeComponent;


        const factory =
          this.cfr.resolveComponentFactory(comp);

        const compRef = this.viewContainer.createComponent(
          factory, null, this.injector);

        this.compInstanceProfilHome = compRef.instance;
        this.compInstanceProfilHome.isProfile = this.isProfile;

        compRef.instance.isChangingEvent.subscribe(event => {
          this.isChangingEvent.emit(event);
        });


      });
    }

    if (this.isReminder && !this.compInstanceReminderHome) {
      import('./../../workplace/reminder/reminder-home/reminder-home.component').then(m => {
        const comp = m.ReminderHomeComponent;


        const factory =
          this.cfr.resolveComponentFactory(comp);

        const compRef = this.viewContainer.createComponent(
          factory, null, this.injector);

        this.compInstanceReminderHome = compRef.instance;
        this.compInstanceReminderHome.isReminder = this.isReminder;

      });
    }

    if (this.isAllWorkshops && !this.compInstanceWorkshopsHome) {
      import('./../../workplace/workshop/all-workshops/workshops-home/workshops-home.component').then(m => {
        const comp = m.WorkshopsHomeComponent;


        const factory =
          this.cfr.resolveComponentFactory(comp);

        const compRef = this.viewContainer.createComponent(
          factory, null, this.injector);

        this.compInstanceWorkshopsHome = compRef.instance;
        this.compInstanceWorkshopsHome.isAllWorkshops = this.isAllWorkshops;

      });
    }

    if (this.isEditWorkshop && !this.compInstanceEditWorkshopHome) {
      import('./../../workplace/workshop/edit-workshop/edit-workshop-home/edit-workshop-home.component').then(m => {
        const comp = m.EditWorkshopHomeComponent;


        const factory =
          this.cfr.resolveComponentFactory(comp);

        const compRef = this.viewContainer.createComponent(
          factory, null, this.injector);

        this.compInstanceEditWorkshopHome = compRef.instance;
        this.compInstanceEditWorkshopHome.isEditWorkshop = this.isEditWorkshop;

        compRef.instance.isChangingEvent.subscribe(event => {
          this.isChangingEvent.emit(event);
        });

        compRef.instance.isEnterEvent.subscribe(event => {
          this.isEnterEvent.emit();
        });
      });
    }

    if (this.isAllDocuments && !this.compInstanceDocumentsHome) {
      import('./../../workplace/document/all-documents/documents-home/documents-home.component').then(m => {
        const comp = m.DocumentsHomeComponent;


        const factory =
          this.cfr.resolveComponentFactory(comp);

        const compRef = this.viewContainer.createComponent(
          factory, null, this.injector);

        this.compInstanceDocumentsHome = compRef.instance;
        this.compInstanceDocumentsHome.isAllDocuments = this.isAllDocuments;


      });
    }

    if (this.isAllInvoices && !this.compInstanceAllInvoicesHome) {
      import('./../../workplace/invoice/all-invoices/all-invoices-home/all-invoices-home.component').then(m => {
        const comp = m.AllInvoicesHomeComponent;


        const factory =
          this.cfr.resolveComponentFactory(comp);

        const compRef = this.viewContainer.createComponent(
          factory, null, this.injector);

        this.compInstanceAllInvoicesHome = compRef.instance;
        this.compInstanceAllInvoicesHome.isAllInvoices = this.isAllInvoices;


      });
    }

    if (this.isInvoices && !this.compInstanceInvoicesHome) {
      import('./../../workplace/invoice/edit-invoices/invoices-home/invoices-home.component').then(m => {
        const comp = m.InvoicesHomeComponent;


        const factory =
          this.cfr.resolveComponentFactory(comp);

        const compRef = this.viewContainer.createComponent(
          factory, null, this.injector);

        this.compInstanceInvoicesHome = compRef.instance;
        this.compInstanceInvoicesHome.isInvoices = this.isInvoices;


      });
    }

    if (this.compInstanceSettingHome) {
      this.compInstanceSettingHome.isSetting = this.isSetting;
    }

    if (this.compInstanceProfilHome) {
      this.compInstanceProfilHome.isProfile = this.isProfile;
    }

    if (this.compInstanceReminderHome) {
      this.compInstanceReminderHome.isReminder = this.isReminder;
    }


    if (this.compInstanceWorkshopsHome) {
      this.compInstanceWorkshopsHome.isAllWorkshops = this.isAllWorkshops;
    }

    if (this.compInstanceEditWorkshopHome) {
      this.compInstanceEditWorkshopHome.isEditWorkshop = this.isEditWorkshop;
    }

    if (this.compInstanceDocumentsHome) {
      this.compInstanceDocumentsHome.isAllDocuments = this.isAllDocuments;
    }

    if (this.compInstanceAllInvoicesHome) {
      this.compInstanceAllInvoicesHome.isAllInvoices = this.isAllInvoices;
    }

    if (this.compInstanceInvoicesHome) {
      this.compInstanceInvoicesHome.isInvoices = this.isInvoices;
    }
  }


  onIsChanging(value) {
    this.isChangingEvent.emit(value);
  }

  onIsEnter() {
    this.isEnterEvent.emit();
  }
}
