import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  AfterViewInit,
  ViewChild, DoCheck,
  OnDestroy,
  IterableDiffers,
  LOCALE_ID,
  Inject,

} from '@angular/core';
import { DataManagementEmployeeService } from 'src/app/data/management/data-management-employee.service';
import { NgForm } from '@angular/forms';
import { ICommunication, Address } from 'src/app/core/employee-class';
import { NgbModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { MessageLibrary } from 'src/app/helpers/string-constants';
import { InitFinished } from 'src/app/helpers/enums/client-enum';
import { formatPhoneNumber, transformDateToNgbDateStruct, transformNgbDateStructToDate } from 'src/app/helpers/format-helper';
import { createStringId } from 'src/app/helpers/object-helpers';

@Component({
  selector: 'app-address-edit-persona',
  templateUrl: './address-edit-persona.component.html',
  styleUrls: ['./address-edit-persona.component.scss'],
})
export class AddressEditPersonaComponent implements OnInit, AfterViewInit, DoCheck, OnDestroy {
  @Output() isChangingEvent = new EventEmitter<boolean>();


  @ViewChild('clientForm', { static: false }) clientForm: NgForm|undefined;




  addStreetLine2 = false;
  addStreetLine3 = false;

  addFirstNameLine2 = false;
  addNameLine2 = false;

  objectForUnsubscribe: any;
  showState = false;

  addressValidFrom: NgbDateStruct|undefined;


  newAddressType = 0;
  newAddressValidFrom: NgbDateStruct = transformDateToNgbDateStruct(new Date())!;
  message = MessageLibrary.DEACTIVE_ADDRESS;
  title = MessageLibrary.DEACTIVE_ADDRESS_TITLE;

  isPhoneValuSeald = false;

  iterableDiffer: any;




  constructor(
    public dataManagementEmployeeService: DataManagementEmployeeService,
    private modalService: NgbModal,
    private iterableDiffers: IterableDiffers,
    @Inject(LOCALE_ID) private locale: string,
  ) { this.iterableDiffer = iterableDiffers.find([]).create(undefined); this.locale = 'de-CH'; }


  ngOnInit(): void {

    this.dataManagementEmployeeService.init();

  }

  ngAfterViewInit(): void {
    this.objectForUnsubscribe = this.clientForm!.valueChanges!.subscribe(() => {

      if (this.clientForm!.dirty === true) {
        setTimeout(() => this.isChangingEvent.emit(true), 100);

        if (!this.dataManagementEmployeeService.editEmployee!.id) {
          setTimeout(() => this.dataManagementEmployeeService.findEmployees(), 100);
        }
      }

    });


    if (this.dataManagementEmployeeService.editEmployee && this.dataManagementEmployeeService.editEmployee.legalEntity) {
      const ele = document.getElementById('profil-company') as HTMLInputElement;
      if (ele) { ele.focus(); }

    } else {
      const ele = document.getElementById('profil-firstname') as HTMLInputElement;
      if (ele) { ele.focus(); }
    }

    if (this.dataManagementEmployeeService.initCount === InitFinished.Finished) {
      setTimeout(() => this.setEnvironmentVariable(), 100);
    }

    this.dataManagementEmployeeService.iniIsRead.subscribe(() => {
      setTimeout(() => this.setEnvironmentVariable(), 100);
    });


    this.dataManagementEmployeeService.isReset.subscribe(x => {
      setTimeout(() => this.isChangingEvent.emit(false), 100);
    });

  }

  ngDoCheck() {

    if (this.dataManagementEmployeeService.editEmployee !== undefined && this.dataManagementEmployeeService.editEmployee!.addresses !== undefined) {

      const x = this.dataManagementEmployeeService.editEmployee!.addresses[this.dataManagementEmployeeService.currentAddressIndex].country;
      this.showState = this.dataManagementEmployeeService.isSwissAbbreviation === x;

    }
  }


  ngOnDestroy(): void {
    if (this.objectForUnsubscribe) { this.objectForUnsubscribe.unsubscribe(); }

  }

  isWeekend(date: NgbDateStruct) {
    const d = new Date(date.year!, date.month! - 1, date.day);
    return d.getDay() === 0 || d.getDay() === 6;
  }

  private setEnvironmentVariable() {
    if (this.dataManagementEmployeeService?.editEmployee?.maidenName) {
      if (this.dataManagementEmployeeService.editEmployee.maidenName !== '') {
        this.addNameLine2 = true;
      }
    }

    if (this.dataManagementEmployeeService?.editEmployee?.secondName) {
      if (this.dataManagementEmployeeService.editEmployee.secondName !== '') {
        this.addFirstNameLine2 = true;
      }
    }

    if (this.dataManagementEmployeeService?.editEmployee?.secondName) {
      if (this.dataManagementEmployeeService.editEmployee.secondName !== '') {
        this.addFirstNameLine2 = true;
      }
    }

    this.assemblyAddress(0);

  }

  assemblyAddress(index: number) {
    if (this.dataManagementEmployeeService.editEmployee?.addresses[index].street2) {
      if (this.dataManagementEmployeeService.editEmployee.addresses[index].street2 !== '') {
        this.addStreetLine2 = true;
      }
    }

    if (this.dataManagementEmployeeService.editEmployee?.addresses[index].street3) {
      if (this.dataManagementEmployeeService.editEmployee.addresses[index].street3 !== '') {
        this.addStreetLine3 = true;
      }
    }
  }



  onChangePhoneType(index: number, event:any) {
    const value = event.currentTarget.value;

    if (value) {
      const tmp = this.dataManagementEmployeeService.communicationPhoneList[index];
      let data = this.dataManagementEmployeeService.editEmployee!.communications.find(x => x.internalId === tmp.internalId);


      if (!data) {

        data = tmp;
        data.internalId = createStringId();
        data.index = index;
        data.type = 0;
        data.isPhone = true;
        this.dataManagementEmployeeService.editEmployee!.communications.push(data);
      }

      data.type = +value;

      this.isChangingEvent.emit(true);
    }

  }


  onChangePhonePrefix(index: number, event:any) :void{

    const value = event.currentTarget.value;
    if (value) {
      const tmp = this.dataManagementEmployeeService.communicationPhoneList[index];
      let data = this.dataManagementEmployeeService.editEmployee!.communications.find(x => x.internalId === tmp.internalId);

      if (!data) {
        data = tmp;
        data.internalId = createStringId();
        data.index = index;
        data.type = 0;
        data.isPhone = true;
        this.dataManagementEmployeeService.editEmployee!.communications.push(data);
      }


      data.prefix = value;

      this.isChangingEvent.emit(true);
    }
  }


  onChangePhoneValue(index: number, event:any) :void {
    if (this.isPhoneValuSeald) { return; }

    const value = event.currentTarget.value;
    if (value) {
      this.isPhoneValuSeald = false;

      const tmp = this.dataManagementEmployeeService.communicationPhoneList[index];
      let data = this.dataManagementEmployeeService.editEmployee!.communications.find(x => x.internalId === tmp.internalId);

      if (!data) {
        data = tmp;
        data.internalId = createStringId();
        data.index = index;
        data.isPhone = true;
        this.dataManagementEmployeeService.editEmployee!.communications.push(data);
      }

      data.value = value;

      this.isChangingEvent.emit(true);
    }
  }

  onKeyupPhoneNumber(pos: number, event:any) :void {
    event.srcElement.value = formatPhoneNumber(event.srcElement.value);

    this.onChangePhoneValue(pos, event);
  }


  onChangeEmailValue(index: number, event:any) :void{
    const value = event.currentTarget.value;
    if (value) {
      const tmp = this.dataManagementEmployeeService.communicationEmailList[index];
      let data = this.dataManagementEmployeeService.editEmployee!.communications.find(x => x.internalId === tmp.internalId);

      if (!data) {

        data = tmp;
        data.internalId = createStringId();
        data.index = index;
        data.isEmail = true;
        this.dataManagementEmployeeService.editEmployee!.communications.push(data);
      }

      data.value = value;
      data.isDeleted = false;

      this.isChangingEvent.emit(true);
    }
  }

  onChangeEmailType(index: number, event:any):void {
    const value = event.currentTarget.value;

    if (value) {
      const tmp = this.dataManagementEmployeeService.communicationEmailList[index];
      let data = this.dataManagementEmployeeService.editEmployee!.communications.find(x => x.internalId === tmp.internalId);

      if (!data) {

        data = tmp;
        data.internalId = createStringId();
        data.index = index;
        data.isEmail = true;
        this.dataManagementEmployeeService.editEmployee!.communications.push(data);
      }

      data.type = +value;

      this.isChangingEvent.emit(true);
    }

  }

  onClickAddPhone() :void{

    this.dataManagementEmployeeService.addPhone();
  }

  onClickDelPhone(data: ICommunication):void {

    this.dataManagementEmployeeService.delPhone(data.index);
    this.isChangingEvent.emit(true);
  }

  onClickAddEmail():void {

    this.dataManagementEmployeeService.addEmail();
  }

  onClickDelEmail(data: ICommunication) :void{

    this.dataManagementEmployeeService.delEmail(data.index);
    this.isChangingEvent.emit(true);
  }

  onAddressTypeName(index: number): string {

    switch (index) {

      case 0:
        return MessageLibrary.ADDRES_TYPE0_NAME;
      case 1:
        return MessageLibrary.ADDRES_TYPE1_NAME;
      case 2:
        return MessageLibrary.ADDRES_TYPE2_NAME;

    }
    return '';
  }

  onDeleteCurrentAddress() :void{
    this.dataManagementEmployeeService.removeCurrentAddress();
    this.isChangingEvent.emit(true);
  }


   openNewAddress(content:any):void {

   
    this.newAddressValidFrom = transformDateToNgbDateStruct(new Date())!;

    this.modalService.open(content, { size: 'md', centered: true, windowClass: 'custom-class' }).result.then(
      () => {
        const c = new Address();
        c.isScoped = true;
        c.type = this.newAddressType;
        c.validFrom = transformNgbDateStructToDate(this.newAddressValidFrom)!;

        this.dataManagementEmployeeService.editEmployee!.addresses.push(c);
        this.dataManagementEmployeeService.currentAddressIndex = this.dataManagementEmployeeService.editEmployee!.addresses.length - 1;

        this.isChangingEvent.emit(true);
      },
      () => { }
    );

  }

  openDeleteAddress(content:any):void {



    this.modalService.open(content, { size: 'sm', centered: true, windowClass: 'custom-class' }).result.then(
      () => {
        this.onDeleteCurrentAddress();
      },
      () => { }
    );

  }

  openAddressList(content:any):void {

    this.dataManagementEmployeeService.readEmployeeAdressListWithoutQueryFilter();

    this.modalService.open(content, { size: 'lg', centered: true, windowClass: 'custom-class' }).result.then(
      () => {

      },
      () => { }
    );

  }

  openHistoryList(content:any):void {

    this.dataManagementEmployeeService.filterHistory.requiredPage = 1;
    this.dataManagementEmployeeService.filterHistory.orderBy = 'validFrom';
    this.dataManagementEmployeeService.filterHistory.sortOrder = 'desc';


    this.dataManagementEmployeeService.readHistory();

    this.modalService.open(content, { size: 'lg', centered: true, windowClass: 'custom-class' }).result.then(
      () => {

      },
      () => { }
    );

  }
  async onZipFocusout() {
     await this.dataManagementEmployeeService.writeCity();
  }


  onIsHistoryPageChange():void {
    this.dataManagementEmployeeService.readHistory();
  }

  onChangingAddress(event: string) :void{
    const address = this.dataManagementEmployeeService.editEmployee!.addresses.find(x => x.id === event);

     
  }
}

