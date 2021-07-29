import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, IterableDiffers, Renderer2 } from '@angular/core';
import { DataManagementEmployeeService } from 'src/app/data/management/data-management-employee.service';
import { NgForm } from '@angular/forms';
import { MessageLibrary } from 'src/app/helpers/string-constants';
import { InitFinished } from 'src/app/helpers/enums/client-enum';


@Component({
  selector: 'app-address-nav',
  templateUrl: './address-nav.component.html',
  styleUrls: ['./address-nav.component.scss']
})
export class AddressNavComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('navAddressForm', { static: false }) navAddressForm: NgForm| undefined;
   navClient: any;

  isComboboxOpen = false;


  objectForUnsubscribe: any;
  clientTypeName = MessageLibrary.ENTITY_TYPE_ALL;

  clientTypeAllAdress = MessageLibrary.ENTITY_TYPE_ALL;
  iterableDiffer: any;
  isInitFinished = false;
  defaultTop: number=0;
  isAfterinit = false;



  constructor(
    public dataManagementEmployeeService: DataManagementEmployeeService,
    private iterableDiffers: IterableDiffers,
    private renderer: Renderer2,
  ) { this.iterableDiffer = iterableDiffers.find([]).create(undefined); }


  ngOnInit(): void {
    this.dataManagementEmployeeService.init();
    this.navClient = document.getElementById('navClientForm');
  }


  ngAfterViewInit(): void {

    if (this.dataManagementEmployeeService.initCount === InitFinished.Finished) {
      this.isInit();
    }

    this.dataManagementEmployeeService.iniIsRead.subscribe(() => {
      this.isInit();
    });

    const res = localStorage.getItem(MessageLibrary.TOKEN) !== null;
    this.objectForUnsubscribe = this.navAddressForm!.valueChanges!.subscribe((x) => {

      if (this.navAddressForm!.dirty) {

        if (!this.isComboboxOpen) { setTimeout(() => this.dataManagementEmployeeService.readPage(), 100); }
      }

    });

    this.isAfterinit = true;
  }




  ngOnDestroy(): void {
    if (this.objectForUnsubscribe) { this.objectForUnsubscribe.unsubscribe(); }
  }

  private isInit(): void{
    
    this.isInitFinished = true;

    const scopeFromFlag = document.getElementById('scopeFromFlag') as HTMLInputElement;
    const scopeUntilFlag = document.getElementById('scopeUntilFlag') as HTMLInputElement;

    if (scopeFromFlag) {
      scopeFromFlag.checked =
        this.dataManagementEmployeeService!.currentFilter!.scopeFromFlag!;
    }

    if (scopeUntilFlag) {
      scopeUntilFlag.checked =
        this.dataManagementEmployeeService!.currentFilter!.scopeUntilFlag!;
    }
  }

  onOpenChange(event: boolean) {
    this.isComboboxOpen = event;
    if (this.isComboboxOpen) {
      this.dataManagementEmployeeService.setTemporaryFilter();
    }
    if (!this.isComboboxOpen && this.dataManagementEmployeeService.isTemoraryFilter_Dirty()) {

      setTimeout(() => {

        this.dataManagementEmployeeService.headerCheckBoxValue = false;

        this.dataManagementEmployeeService.showProgressSpinner = true;
        this.dataManagementEmployeeService.readPage();
      }
        , 100);
    }
  }

  

  onClickSetEmpty() {

    localStorage.removeItem('edit-address');
    this.dataManagementEmployeeService.currentFilter.setEmpty();
    (document.getElementById('scopeFromFlag') as HTMLInputElement).checked = false;
    (document.getElementById('scopeUntilFlag') as HTMLInputElement).checked = false;

  }

  onClickClientType(index: number) {



      this.dataManagementEmployeeService.clearCheckedArray();
      this.dataManagementEmployeeService.headerCheckBoxValue = false;

  

    setTimeout(() => {
      this.dataManagementEmployeeService.showProgressSpinner = true;
      this.dataManagementEmployeeService.readPage();
    }
      , 100);
  }


  isRequestPossible(): boolean {
    return this.dataManagementEmployeeService.currentFilter.male ||
      this.dataManagementEmployeeService.currentFilter.female ||
      this.dataManagementEmployeeService.currentFilter.legalEntity;
  }

  

}
