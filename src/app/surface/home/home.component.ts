import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  HostListener,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataManagementSwitchboardService } from 'src/app/data/management/data-management-switchboard.service';
import { MessageLibrary } from 'src/app/helpers/string-constants';
import { CanComponentDeactivate } from 'src/app/helpers/can-deactivate.guard';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { DataLoadFileService } from 'src/app/data/data-load-file.service';
import { DataSettingsVariousService } from 'src/app/data/data-settings-various.service';
import { AppSetting, ISetting } from 'src/app/core/settings-various-class';




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

  @ViewChild('content', { static: false }) private content: any;

  isDashboard = true;
  isAllAddress = false;
  isEditAddress = false;
  isProfile = false;
  isSetting = false;
  isAbsenceCalendar = false;

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
    this.saveBarWrapper!.style.setProperty('--footer_height', '0px');

    this.dataManagementSwitchboardService.showProgressSpinner = false;

    this.route.params.subscribe((params: Params) => {
      this.getClientType(params.id);
    });

    try {
      this.dataSettingsVariousService.readSettingList().subscribe((l: ISetting[]) => {
        if (l) {
          const tmp = l;
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
      '' : localStorage.getItem(MessageLibrary.ROUTER_TOKEN) as string;

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
        import('./../../workplace/dashboard/dashboard.module').then(m => m.DashboardModule);
        localStorage.removeItem(MessageLibrary.ROUTER_SUBTOKEN);
        localStorage.removeItem(MessageLibrary.ROUTER_TOKEN);
        localStorage.setItem(MessageLibrary.ROUTER_TOKEN, 'workplace/dashboard');
        this.isDashboard = true;

        break;

      case 'all-addresses':
        import('./../../workplace/address/address.module').then(m => m.AddressModule);
        localStorage.removeItem(MessageLibrary.ROUTER_SUBTOKEN);
        localStorage.removeItem(MessageLibrary.ROUTER_TOKEN);
        localStorage.setItem(MessageLibrary.ROUTER_TOKEN, 'workplace/all-addresses');
        this.isAllAddress = true;
        break;

      case 'edit-address':
        import('./../../workplace/address/address.module').then(m => m.AddressModule);
        this.isEditAddress = true;
        this.isSavebarVisible = true;
        break;

      case 'profile':
        localStorage.removeItem(MessageLibrary.ROUTER_SUBTOKEN);
        import('./../../workplace/profil/profil.module').then(m => m.ProfilModule);

        this.isProfile = true;
        this.isSavebarVisible = true;
        break;

      case 'setting':
        localStorage.removeItem(MessageLibrary.ROUTER_SUBTOKEN);
        import('./../../workplace/setting/settings.module').then(m => m.SettingsModule);

        this.isSetting = true;
        this.isSavebarVisible = true;
        break;

      case 'absence-calendar':
        localStorage.removeItem(MessageLibrary.ROUTER_SUBTOKEN);
        import('./../../workplace/absence-calendar/absence-calendar.module').then(m => m.AbsenceCalendarModule);

        this.isAbsenceCalendar = true;
        this.isSavebarVisible = false;
        break;

      default:

        localStorage.removeItem(MessageLibrary.ROUTER_TOKEN);
        localStorage.setItem(MessageLibrary.ROUTER_TOKEN, 'workplace/dashboard');
        this.isDashboard = true;
    }

    if (this.isSavebarVisible) {
      this.saveBarWrapper!.style.setProperty('--footer_height', '65px');
    } else {
      this.saveBarWrapper!.style.setProperty('--footer_height', '0px');
    }
  }

  open(content: any): Promise<boolean> {
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
    this.isAllAddress = false;
    this.isEditAddress = false;
    this.isProfile = false;
    this.isSetting = false;
    this.isAbsenceCalendar = false;

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
