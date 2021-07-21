import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  HostListener,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataManagementSwitchboardService } from 'src/app/data/management/data-management-switchboard.service';
import { MessageLibrary } from 'src/app/helpers/string-constants';
import { CanComponentDeactivate } from 'src/app/helpers/can-deactivate.guard';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { AppSetting, ISetting } from 'src/app/core/settings-various-class';
import { DataSettingsVariousService } from 'src/app/data/data-settings-various.service';
import { DataLoadFileService } from 'src/app/data/data-load-file.service';



@Component({
  selector: 'app-workplace-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, CanComponentDeactivate {



  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    @Inject(DataManagementSwitchboardService)
    public dataManagementSwitchboardService: DataManagementSwitchboardService,
    private router: Router,
    private titleService: Title,
    @Inject(DataSettingsVariousService) private dataSettingsVariousService: DataSettingsVariousService,
    @Inject(DataLoadFileService) private dataLoadFileService: DataLoadFileService,
  ) { }

  @ViewChild('content', { static: false }) private content;

  isDashboard = true;
  isAllAddsresses = false;
  isAllWorkshops = false;
  isAllDocuments = false;
  isAllInvoices = false;
  isInvoices = false;
  isProfile = false;
  isSetting = false;
  isReminder = false;
  isAllExports = false;

  isEditAddress = false;
  isEditWorkshop = false;
  isEditExport = false;


  isSavebarVisible = false;
  routerToken = '';

  private saveBarWrapper = document.querySelector('body');

  @HostListener('keyup', ['$event']) onkeyup(event: KeyboardEvent) {

    if (event.key === 'Escape') {
      this.onClickGoBack();
    }
  }
  ngOnInit(): void {
    this.setTheme();
    this.tryLoadIcon();
    this.saveBarWrapper.style.setProperty('--footer_height', '0px');

    this.dataManagementSwitchboardService.showProgressSpinner = false;

    this.route.params.subscribe((params) => {
      this.getClientType(params.id);
    });


    try {
      this.dataSettingsVariousService.readSettingList().subscribe((l) => {
        if (l) {
          const tmp = l as ISetting[];
          const title = tmp.find(x => x.type === AppSetting.APP_NAME);
          if (title && title.value) { this.titleService.setTitle(title.value); }
        }
      });
    } catch (e) {
      console.log(e);
    }


  }


  async canDeactivate(): Promise<boolean> {
    if (this.dataManagementSwitchboardService === undefined) { return true; }
    if (this.dataManagementSwitchboardService.isDirty === false) { return true; }

    return this.open(this.content).then(
      x => {
        return x;
      });

  }

  onIsChanging(value: boolean) {
    if (value === true) {
      this.dataManagementSwitchboardService.areObjectsDirty();
    } else {
      this.dataManagementSwitchboardService.checkIfDirtyIsNecessary();
    }

  }

  onClickSave() {

    this.dataManagementSwitchboardService.onClickSave();
  }

  onIsEnter() {
    this.dataManagementSwitchboardService.onClickSave();
  }

  onClickReset() {
    this.dataManagementSwitchboardService.reset();
  }


  onClickGoBack() {
    const subToken = localStorage.getItem(MessageLibrary.ROUTER_SUBTOKEN) === null ?
      '' : localStorage.getItem(MessageLibrary.ROUTER_SUBTOKEN);

    if (subToken !== '') {
      localStorage.removeItem(MessageLibrary.ROUTER_SUBTOKEN);
      this.router.navigate([subToken]);
      return;
    }

    this.routerToken = localStorage.getItem(MessageLibrary.ROUTER_TOKEN) === null ?
      '' : localStorage.getItem(MessageLibrary.ROUTER_TOKEN);

    if (this.routerToken !== '') {
      this.router.navigate([this.routerToken]);
      return;
    }

    this.router.navigate(['/']);
  }

  getClientType(value: string) {


    this.reset();

    switch (value) {
      case 'dashboard':

        localStorage.removeItem(MessageLibrary.ROUTER_SUBTOKEN);
        localStorage.removeItem(MessageLibrary.ROUTER_TOKEN);
        localStorage.setItem(MessageLibrary.ROUTER_TOKEN, 'workplace/dashboard');
        this.isDashboard = true;

        break;
      case 'all-addresses':

        localStorage.removeItem(MessageLibrary.ROUTER_SUBTOKEN);
        localStorage.removeItem(MessageLibrary.ROUTER_TOKEN);
        localStorage.setItem(MessageLibrary.ROUTER_TOKEN, 'workplace/all-addresses');
        this.isAllAddsresses = true;
        break;

      case 'all-workshops':
        import('./../../workplace/workshop/workshop.module').then(m => m.WorkshopModule);


        localStorage.removeItem(MessageLibrary.ROUTER_SUBTOKEN);
        localStorage.removeItem(MessageLibrary.ROUTER_TOKEN);
        localStorage.setItem(MessageLibrary.ROUTER_TOKEN, 'workplace/all-workshops');
        this.isAllWorkshops = true;
        break;

      case 'all-documents':
        import('./../../workplace/document/document.module').then(m => m.DocumentModule);

        localStorage.removeItem(MessageLibrary.ROUTER_SUBTOKEN);
        localStorage.removeItem(MessageLibrary.ROUTER_TOKEN);
        localStorage.setItem(MessageLibrary.ROUTER_TOKEN, 'workplace/all-documents');
        this.isAllDocuments = true;
        break;
      case 'all-invoices':
        import('./../../workplace/invoice/invoice.module').then(m => m.InvoiceModule);

        localStorage.removeItem(MessageLibrary.ROUTER_SUBTOKEN);
        localStorage.removeItem(MessageLibrary.ROUTER_TOKEN);
        localStorage.setItem(MessageLibrary.ROUTER_TOKEN, 'workplace/all-invoices');
        this.isAllInvoices = true;
        break;
      case 'invoices':
        localStorage.removeItem(MessageLibrary.ROUTER_SUBTOKEN);
        import('./../../workplace/invoice/invoice.module').then(m => m.InvoiceModule);

        this.isInvoices = true;
        break;

      case 'reminder':
        localStorage.removeItem(MessageLibrary.ROUTER_SUBTOKEN);
        import('./../../workplace/reminder/reminder.module').then(m => m.ReminderModule);

        this.isReminder = true;
        break;

      case 'all-exports':
        localStorage.removeItem(MessageLibrary.ROUTER_SUBTOKEN);
        localStorage.removeItem(MessageLibrary.ROUTER_TOKEN);
        localStorage.setItem(MessageLibrary.ROUTER_TOKEN, 'workplace/all-exports');
        this.isAllExports = true;
        break;

      case 'profile':
        localStorage.removeItem(MessageLibrary.ROUTER_SUBTOKEN);
        import('./../../workplace/profil/profil.module').then(m => m.ProfilModule);

        this.isProfile = true;
        this.isSavebarVisible = true;
        break;
      case 'settings':
        localStorage.removeItem(MessageLibrary.ROUTER_SUBTOKEN);
        import('./../../workplace/setting/settings.module').then(m => m.SettingsModule);

        this.isSetting = true;
        this.isSavebarVisible = true;
        break;



      case 'edit-address':
        this.isEditAddress = true;
        this.isSavebarVisible = true;
        break;

      case 'edit-workshop':
        import('./../../workplace/workshop/workshop.module').then(m => m.WorkshopModule);

        this.isEditWorkshop = true;
        this.isSavebarVisible = true;
        break;

      case 'edit-export':

        localStorage.setItem(MessageLibrary.ROUTER_SUBTOKEN, '/workplace/edit-export');
        this.isEditExport = true;

        break;

      default:

        localStorage.removeItem(MessageLibrary.ROUTER_TOKEN);
        localStorage.setItem(MessageLibrary.ROUTER_TOKEN, 'workplace/dashboard');
        this.isDashboard = true;
    }

    if (this.isSavebarVisible) {
      this.saveBarWrapper.style.setProperty('--footer_height', '65px');
    } else {
      this.saveBarWrapper.style.setProperty('--footer_height', '0px');
    }
  }

  open(content): Promise<boolean> {
    return this.modalService
      .open(content, { size: 'sm', centered: true })
      .result.then((x) => {

        this.dataManagementSwitchboardService.isDirty = false;
        return true;
      },
        () => {
          return false;
        }
      );
  }

  private reset() {

    this.isDashboard = false;
    this.isAllAddsresses = false;
    this.isAllWorkshops = false;
    this.isAllDocuments = false;
    this.isAllInvoices = false;
    this.isInvoices = false;
    this.isProfile = false;
    this.isSetting = false;
    this.isReminder = false;
    this.isAllExports = false;

    this.isEditAddress = false;
    this.isEditWorkshop = false;
    this.isEditExport = false;

    this.isSavebarVisible = false;
    this.dataManagementSwitchboardService.isDisabled = false;
  }

  tryLoadIcon() {

    this.dataLoadFileService.downLoadIcon();
    this.dataLoadFileService.downLoadLogo();
  }

  setTheme() {
    const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;
    if (currentTheme) {
      document.documentElement.setAttribute('data-theme', currentTheme);

    }
  }

}
