import { Component, OnInit, IterableDiffers, OnDestroy, AfterViewInit, ViewChild, Output, EventEmitter, NgZone } from '@angular/core';
import { DataManagementClientService } from 'src/app/data/management/data-management-client.service';
import { NgForm } from '@angular/forms';
import { IMembershipAttribute, OwnerDefinedValue } from 'src/app/core/client-class';
import { IAttributeValue } from 'src/app/core/address-attribute-member-class';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ICredit } from 'src/app/core/journal-class';
import { MessageLibrary } from 'src/app/helpers/string-constants';



@Component({
  selector: 'app-membership',
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.scss']
})
export class MembershipComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('membershipForm', { static: false }) membershipForm: NgForm;
  @Output() isChangingEvent = new EventEmitter<boolean>();



  isAuthorised = false;

  now = new Date();

  objectForUnsubscribe: any;

  iterableDiffer: any;
  membershipAttribute: IMembershipAttribute[];


  constructor(
    public dataManagementClientService: DataManagementClientService,
    private modalService: NgbModal,
    private iterableDiffers: IterableDiffers
  ) { this.iterableDiffer = iterableDiffers.find([]).create(null); }


  ngOnInit(): void {


  }

  ngAfterViewInit(): void {
    this.objectForUnsubscribe = this.membershipForm.valueChanges.subscribe(() => {

      if (this.membershipForm.dirty === true) {
        setTimeout(() => this.isChangingEvent.emit(true), 100);

      }

    });

    if (localStorage.getItem(MessageLibrary.TOKEN_AUTHORISED)) {
      this.isAuthorised = JSON.parse(localStorage.getItem(MessageLibrary.TOKEN_AUTHORISED));
    }
  }




  ngOnDestroy(): void {
    if (this.objectForUnsubscribe) { this.objectForUnsubscribe.unsubscribe(); }

  }

  onClickRadio(c: IMembershipAttribute, opt: IAttributeValue, event) {
    const ev = event.srcElement.value;

    const index = this.dataManagementClientService?.editClient?.membership.ownerDefinedValues.findIndex(x => x.attributeBaseId === c.id);

    if (index === -1) {
      const tmp = new OwnerDefinedValue();
      tmp.attributeBaseId = c.id;
      tmp.name = c.name;
      tmp.value = opt.value;
      this.dataManagementClientService?.editClient?.membership.ownerDefinedValues.push(tmp);

    } else {
      const tmp = this.dataManagementClientService?.editClient?.membership.ownerDefinedValues[index];
      tmp.value = opt.value;
      if (tmp.isDeleted) { tmp.isDeleted = false; }
    }

    this.isChangingEvent.emit(true);
  }

  valueRadio(c: IMembershipAttribute, opt: IAttributeValue) {

    const index = this.dataManagementClientService?.editClient?.membership.ownerDefinedValues.findIndex(x => x.attributeBaseId === c.id);

    if (index === -1) {
      return null;

    } else {
      const tmp = this.dataManagementClientService?.editClient?.membership.ownerDefinedValues[index];
      if (tmp.isDeleted) { return null; }
      return (tmp.value === opt.value) as boolean;
    }
  }

  onChangeList(c: IMembershipAttribute, event) {
    const ev = event.srcElement.value;

    const index = this.dataManagementClientService?.editClient?.membership.ownerDefinedValues.findIndex(x => x.attributeBaseId === c.id);

    if (index === -1) {
      const tmp = new OwnerDefinedValue();
      tmp.attributeBaseId = c.id;
      tmp.name = c.name;
      tmp.value = +ev;
      this.dataManagementClientService?.editClient?.membership.ownerDefinedValues.push(tmp);

    } else {
      const tmp = this.dataManagementClientService?.editClient?.membership.ownerDefinedValues[index];
      tmp.value = +ev;
    }

    this.isChangingEvent.emit(true);


  }

  valueList(c: IMembershipAttribute, value: number) {

    const index = this.dataManagementClientService?.editClient?.membership.ownerDefinedValues.findIndex(x => x.attributeBaseId === c.id);

    if (index === -1) {
      return null;

    } else {
      const tmp = this.dataManagementClientService?.editClient?.membership.ownerDefinedValues[index];
      return (tmp.value === value) as boolean;
    }
  }

  onChangeDateBack(event) {

    if (event) {
      if (typeof event === 'object' && (event.hasOwnProperty('year') && event.hasOwnProperty('month') && event.hasOwnProperty('day'))) {
        if (event.year.toString().lenght === 4 && event.month.toString().lenght === 2 && event.day.toString().lenght === 2) {
          return new Date(event.year, event.month - 1, event.day);
        }
        return event;
      } else {
        return event;
      }
    }
    return null;
  }

  openCredits(content) {

    this.dataManagementClientService.creditFilter.requiredPage = 1;
    this.dataManagementClientService.readTruncatedCreditList();

    this.modalService.open(content, { size: 'lg', centered: true }).result.then(
      () => {
        // this.onDeleteCurrentAddress();
      },
      () => { }
    );

  }

  onPageChange(event: number) {
    this.dataManagementClientService.creditFilter.requiredPage = event;
    this.dataManagementClientService.readTruncatedCreditList();
  }

  onCorrection(event: ICredit) {
    this.dataManagementClientService.addCredit(event);
  }

  dowloadTestaHeft(){
    this.dataManagementClientService.dowloadTestatHeft();
  }
}
