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
  ViewEncapsulation,
} from '@angular/core';
import { DataManagementClientService } from 'src/app/data/management/data-management-client.service';
import { NgForm } from '@angular/forms';
import { ICommunication, Address, IMembershipAttribute } from 'src/app/core/client-class';
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


  @ViewChild('clientForm', { static: false }) clientForm: NgForm;




  addStreetLine2 = false;
  addStreetLine3 = false;

  addFirstNameLine2 = false;
  addNameLine2 = false;

  objectForUnsubscribe: any;
  showState = false;

  editClientType = 0;
  addressType = 0;
  addressValidFrom: NgbDateStruct;
  membershipAttribute: IMembershipAttribute[];

  newAddressType = 0;
  newAddressValidFrom: NgbDateStruct = transformDateToNgbDateStruct(new Date());
  message = MessageLibrary.DEACTIVE_ADDRESS;
  title = MessageLibrary.DEACTIVE_ADDRESS_TITLE;

  isPhoneValuSeald = false;

  iterableDiffer: any;




  constructor(
    public dataManagementClientService: DataManagementClientService,
    private modalService: NgbModal,
    private iterableDiffers: IterableDiffers,
    @Inject(LOCALE_ID) private locale: string,
  ) { this.iterableDiffer = iterableDiffers.find([]).create(null); this.locale = 'de-CH'; }


  ngOnInit(): void {

    this.dataManagementClientService.init();

  }

  ngAfterViewInit(): void {
    this.objectForUnsubscribe = this.clientForm.valueChanges.subscribe(() => {

      if (this.clientForm.dirty === true) {
        setTimeout(() => this.isChangingEvent.emit(true), 100);

        if (!this.dataManagementClientService.editClient.id) {
          setTimeout(() => this.dataManagementClientService.findClients(), 100);
        }
      }

    });


    if (this.dataManagementClientService.editClient && this.dataManagementClientService.editClient.legalEntity) {
      const ele = document.getElementById('profil-company') as HTMLInputElement;
      if (ele) { ele.focus(); }

    } else {
      const ele = document.getElementById('profil-firstname') as HTMLInputElement;
      if (ele) { ele.focus(); }
    }

    if (this.dataManagementClientService.initCount === InitFinished.Finished) {
      setTimeout(() => this.setEnvironmentVariable(), 100);
    }

    this.dataManagementClientService.iniIsRead.subscribe(() => {
      setTimeout(() => this.setEnvironmentVariable(), 100);
    });


    this.dataManagementClientService.isReset.subscribe(x => {
      setTimeout(() => this.isChangingEvent.emit(false), 100);
    });

  }

  ngDoCheck() {

    if (this.dataManagementClientService.editClient !== undefined && this.dataManagementClientService.editClient.addresses !== undefined) {

      const x = this.dataManagementClientService.editClient.addresses[this.dataManagementClientService.currentAddressIndex].country;
      this.showState = this.dataManagementClientService.isSwissAbbreviation === x;

    }
  }


  ngOnDestroy(): void {
    if (this.objectForUnsubscribe) { this.objectForUnsubscribe.unsubscribe(); }

  }

  isWeekend(date: NgbDateStruct) {
    const d = new Date(date.year, date.month - 1, date.day);
    return d.getDay() === 0 || d.getDay() === 6;
  }

  private setEnvironmentVariable() {
    if (this.dataManagementClientService?.editClient?.maidenName) {
      if (this.dataManagementClientService.editClient.maidenName !== '') {
        this.addNameLine2 = true;
      }
    }

    if (this.dataManagementClientService?.editClient?.secondName) {
      if (this.dataManagementClientService.editClient.secondName !== '') {
        this.addFirstNameLine2 = true;
      }
    }

    if (this.dataManagementClientService?.editClient?.secondName) {
      if (this.dataManagementClientService.editClient.secondName !== '') {
        this.addFirstNameLine2 = true;
      }
    }

    this.assemblyAddress(0);

  }

  assemblyAddress(index: number) {
    if (this.dataManagementClientService.editClient?.addresses[index].street2) {
      if (this.dataManagementClientService.editClient.addresses[index].street2 !== '') {
        this.addStreetLine2 = true;
      }
    }

    if (this.dataManagementClientService.editClient?.addresses[index].street3) {
      if (this.dataManagementClientService.editClient.addresses[index].street3 !== '') {
        this.addStreetLine3 = true;
      }
    }
  }



  onChangePhoneType(index: number, event) {
    const value = event.currentTarget.value;

    if (value) {
      const tmp = this.dataManagementClientService.communicationPhoneList[index];
      let data = this.dataManagementClientService.editClient.communications.find(x => x.internalId === tmp.internalId);


      if (!data) {

        data = tmp;
        data.internalId = createStringId();
        data.index = index;
        data.type = 0;
        data.isPhone = true;
        this.dataManagementClientService.editClient.communications.push(data);
      }

      data.type = +value;

      this.isChangingEvent.emit(true);
    }

  }


  onChangePhonePrefix(index: number, event) {

    const value = event.currentTarget.value;
    if (value) {
      const tmp = this.dataManagementClientService.communicationPhoneList[index];
      let data = this.dataManagementClientService.editClient.communications.find(x => x.internalId === tmp.internalId);

      if (!data) {
        data = tmp;
        data.internalId = createStringId();
        data.index = index;
        data.type = 0;
        data.isPhone = true;
        this.dataManagementClientService.editClient.communications.push(data);
      }


      data.prefix = value;

      this.isChangingEvent.emit(true);
    }
  }


  onChangePhoneValue(index: number, event) {
    if (this.isPhoneValuSeald) { return; }

    const value = event.currentTarget.value;
    if (value) {
      this.isPhoneValuSeald = false;

      const tmp = this.dataManagementClientService.communicationPhoneList[index];
      let data = this.dataManagementClientService.editClient.communications.find(x => x.internalId === tmp.internalId);

      if (!data) {
        data = tmp;
        data.internalId = createStringId();
        data.index = index;
        data.isPhone = true;
        this.dataManagementClientService.editClient.communications.push(data);
      }

      data.value = value;

      this.isChangingEvent.emit(true);
    }
  }

  onKeyupPhoneNumber(pos: number, event) {
    event.srcElement.value = formatPhoneNumber(event.srcElement.value);

    this.onChangePhoneValue(pos, event);
  }


  onChangeEmailValue(index: number, event) {
    const value = event.currentTarget.value;
    if (value) {
      const tmp = this.dataManagementClientService.communicationEmailList[index];
      let data = this.dataManagementClientService.editClient.communications.find(x => x.internalId === tmp.internalId);

      if (!data) {

        data = tmp;
        data.internalId = createStringId();
        data.index = index;
        data.isEmail = true;
        this.dataManagementClientService.editClient.communications.push(data);
      }

      data.value = value;
      data.isDeleted = false;

      this.isChangingEvent.emit(true);
    }
  }

  onChangeEmailType(index: number, event) {
    const value = event.currentTarget.value;

    if (value) {
      const tmp = this.dataManagementClientService.communicationEmailList[index];
      let data = this.dataManagementClientService.editClient.communications.find(x => x.internalId === tmp.internalId);

      if (!data) {

        data = tmp;
        data.internalId = createStringId();
        data.index = index;
        data.isEmail = true;
        this.dataManagementClientService.editClient.communications.push(data);
      }

      data.type = +value;

      this.isChangingEvent.emit(true);
    }

  }

  onClickAddPhone() {

    this.dataManagementClientService.addPhone();
  }

  onClickDelPhone(data: ICommunication) {

    this.dataManagementClientService.delPhone(data.index);
    this.isChangingEvent.emit(true);
  }

  onClickAddEmail() {

    this.dataManagementClientService.addEmail();
  }

  onClickDelEmail(data: ICommunication) {

    this.dataManagementClientService.delEmail(data.index);
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
  }

  onDeleteCurrentAddress() {
    this.dataManagementClientService.removeCurrentAddress();
    this.isChangingEvent.emit(true);
  }


  openAddressType(content) {
    const tmpDate = new Date(
      this.dataManagementClientService.editClient.addresses[this.dataManagementClientService.currentAddressIndex].validFrom);
    this.editClientType = +this.dataManagementClientService.editClient.type;
    this.addressType = +this.dataManagementClientService.editClient.addresses[this.dataManagementClientService.currentAddressIndex].type;

    this.addressValidFrom = transformDateToNgbDateStruct(tmpDate);

    this.modalService.open(content, { size: 'md', centered: true, windowClass: 'custom-class' }).result.then(
      () => {

        this.dataManagementClientService
          .editClient
          .addresses[this.dataManagementClientService.currentAddressIndex].validFrom = transformNgbDateStructToDate(this.addressValidFrom);

        const clientType = +this.editClientType;

        // spezifische Daten löschen
        if (this.dataManagementClientService.editClient.type !== clientType) {
          this.dataManagementClientService.editClient.membership.ownerDefinedValues.forEach(x => {
            x.isDeleted = true;
          });
          this.dataManagementClientService.editClient.membership.status = '';
          this.dataManagementClientService.editClient.membership.section = '';
        }

        this.dataManagementClientService.editClient.type = clientType;
        this.dataManagementClientService
          .editClient.addresses[this.dataManagementClientService.currentAddressIndex].type = +this.addressType;

        this.dataManagementClientService.prepareClient(this.dataManagementClientService.editClient, true);

        this.isChangingEvent.emit(true);
      },
      () => { }
    );

  }

  openNewAddress(content) {

    this.newAddressType = +this.dataManagementClientService.editClient.addresses[this.dataManagementClientService.currentAddressIndex].type;
    this.newAddressValidFrom = transformDateToNgbDateStruct(new Date());

    this.modalService.open(content, { size: 'md', centered: true, windowClass: 'custom-class' }).result.then(
      () => {
        const c = new Address();
        c.isScoped = true;
        c.type = this.newAddressType;
        c.validFrom = transformNgbDateStructToDate(this.newAddressValidFrom);

        this.dataManagementClientService.editClient.addresses.push(c);
        this.dataManagementClientService.currentAddressIndex = this.dataManagementClientService.editClient.addresses.length - 1;

        this.isChangingEvent.emit(true);
      },
      () => { }
    );

  }

  openDeleteAddress(content) {



    this.modalService.open(content, { size: 'sm', centered: true, windowClass: 'custom-class' }).result.then(
      () => {
        this.onDeleteCurrentAddress();
      },
      () => { }
    );

  }

  openAddressList(content) {

    this.dataManagementClientService.readClientAdressListWithoutQueryFilter();

    this.modalService.open(content, { size: 'lg', centered: true, windowClass: 'custom-class' }).result.then(
      () => {

      },
      () => { }
    );

  }

  openHistoryList(content) {

    this.dataManagementClientService.filterHistory.requiredPage = 1;
    this.dataManagementClientService.filterHistory.orderBy = 'validFrom';
    this.dataManagementClientService.filterHistory.sortOrder = 'desc';


    this.dataManagementClientService.readHistory();

    this.modalService.open(content, { size: 'lg', centered: true, windowClass: 'custom-class' }).result.then(
      () => {

      },
      () => { }
    );

  }
  async onZipFocusout() {
    await this.dataManagementClientService.writeCity();
  }


  onIsHistoryPageChange() {
    this.dataManagementClientService.readHistory();
  }

  onChangingAddress(event: string) {
    const address = this.dataManagementClientService.editClient.addresses.find(x => x.id === event);

    if (address.id === event) {
      address.isDeleted = false;
      address.currentUserDeleted = '';
      this.dataManagementClientService.reReadAddress();
      this.isChangingEvent.emit(true);
    }

  }
}

