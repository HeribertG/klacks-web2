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

  ) { }

  @ViewChild('content', { static: false }) private content:any;

  
  isAllAddsresses = true;
  isEditAddress= false;

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
    // this.tryLoadIcon();
    this.saveBarWrapper!.style.setProperty('--footer_height', '0px');

    this.dataManagementSwitchboardService.showProgressSpinner = false;

    this.route.params.subscribe((params) => {
      this.getClientType(params.id);
    });

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
      
      case 'all-addresses':

        localStorage.removeItem(MessageLibrary.ROUTER_SUBTOKEN);
        localStorage.removeItem(MessageLibrary.ROUTER_TOKEN);
        localStorage.setItem(MessageLibrary.ROUTER_TOKEN, 'workplace/all-addresses');
        this.isAllAddsresses = true;
        break;

      case 'edit-address':
        this.isEditAddress = true;
        this.isSavebarVisible = true;
        break;

     

      default:

        localStorage.removeItem(MessageLibrary.ROUTER_TOKEN);
        localStorage.setItem(MessageLibrary.ROUTER_TOKEN, 'workplace/dashboard');
        this.isAllAddsresses = true;
    }

    if (this.isSavebarVisible) {
      this.saveBarWrapper!.style.setProperty('--footer_height', '65px');
    } else {
      this.saveBarWrapper!.style.setProperty('--footer_height', '0px');
    }
  }

  open(content:any): Promise<boolean> {
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

    
    this.isAllAddsresses = false;
    

    this.isEditAddress = false;
    
    this.isSavebarVisible = false;
    this.dataManagementSwitchboardService.isDisabled = false;
  }

  // tryLoadIcon() {

  //   this.dataLoadFileService.downLoadIcon();
  //   this.dataLoadFileService.downLoadLogo();
  // }

  setTheme() {
    const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;
    if (currentTheme) {
      document.documentElement.setAttribute('data-theme', currentTheme);

    }
  }

}
