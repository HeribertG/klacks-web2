import { Component, EventEmitter, Inject, Input, LOCALE_ID, OnChanges, OnInit, Output } from '@angular/core';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectType } from 'src/app/core/invoice-class';
import { IJournal, Journal } from 'src/app/core/journal-class';
import {
  DateToStringShort,
  dateWithLocalTimeCorrection,
  isNgbDateStructOk,
  transformDateToNgbDateStruct,
  transformNgbDateStructToDate
} from 'src/app/helpers/format-helper';
import { MessageLibrary } from 'src/app/helpers/string-constants';


@Component({
  selector: 'app-monetary-template',
  templateUrl: './monetary.component.html',
  styleUrls: ['./monetary.component.scss']
})
export class MonetaryTemplateComponent implements OnInit, OnChanges {

  @Input() isAuthorised: boolean;
  @Input() journalHeader: string;
  @Input() journalSum: number;
  @Input() journalCount: number;
  @Input() journalBases: IJournal[];
  @Input() invoiceBaseTypeExportList: SelectType[];
  @Input() journalRequiredPage: number;
  @Input() journalNumberOfItemsPerPage: number;
  @Input() clientId: string;
  @Output() pageChange = new EventEmitter<number>();
  @Output() addJournal = new EventEmitter<IJournal>();
  @Output() updateJournal = new EventEmitter<IJournal>();

  newCorrectionFrom: NgbDateStruct = transformDateToNgbDateStruct(new Date());
  newCorrectionType = 0;
  newCorrectionValue = 0;
  newCorrectionRemark = '';
  newCorrectionText = '';
  originalIsAuthorised = false;
  newType = 0;

  titleOverpayment = '';
  messageOverpayment = '';

  constructor(
    private modalService: NgbModal,
    @Inject(LOCALE_ID) private locale: string) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes) {

    this.originalIsAuthorised = this.isAuthorised;

    if (!this.clientId) { this.originalIsAuthorised = false; }
  }

  onPageChange() {
    setTimeout(() => this.pageChange.emit(this.journalRequiredPage), 100);

  }

  isMinus(data: IJournal): number {
    if (data.value < 0) { return data.value * -1; }
    return null;
  }

  isPlus(data: IJournal): number {
    if (data.value >= 0) { return data.value; }
    return null;
  }

  onIsDisabled(): boolean {
    return this.newCorrectionFrom === undefined || this.newCorrectionFrom === null || this.newCorrectionValue <= 0;
  }

  onOpen(content) {

    this.newCorrectionFrom = transformDateToNgbDateStruct(new Date());
    this.newCorrectionType = 0;
    this.newCorrectionValue = 0;
    this.newCorrectionRemark = '';
    this.newCorrectionText = '';

    this.modalService.open(content, { size: 'sm', centered: true }).result.then(
      () => {
        this.addCorrection();
      },
      () => { }
    );

  }

  private addCorrection() {
    if (isNgbDateStructOk(this.newCorrectionFrom) && this.newCorrectionValue > 0) {
      const tmp = new Journal();
      const user = localStorage.getItem(MessageLibrary.TOKEN_USERNAME);
      tmp.clientId = this.clientId;
      tmp.validFrom = dateWithLocalTimeCorrection(transformNgbDateStructToDate(this.newCorrectionFrom));
      tmp.remark = this.newCorrectionRemark;
      tmp.name = this.newCorrectionText;
      tmp.description = 'KORREKTUR von ' + user;
      tmp.individuallyChanged = true;
      tmp.type = +this.newType;

      switch (+this.newCorrectionType) {
        case 0:
          tmp.value = this.newCorrectionValue;
          break;
        case 1:
          tmp.value = this.newCorrectionValue * -1;

      }

      this.addJournal.emit(tmp);
    }
  }

  onclickResetDoublePayment(content, data: IJournal) {

    this.titleOverpayment = 'Doppelzahlung';
    this.messageOverpayment = 'Wollen sie die Doppelzahlung "' + data.name + '" rückgägig machen?';

    this.modalService.open(content, { size: 'sm', centered: true, windowClass: 'custom-class' }).result.then(
      () => {
        const tmp = new Journal();
        const user = localStorage.getItem(MessageLibrary.TOKEN_USERNAME);
        tmp.clientId = this.clientId;
        tmp.validFrom = dateWithLocalTimeCorrection(new Date());
        tmp.invoiceBase = data.invoiceBase;
        tmp.name = data.name;
        tmp.description = 'KORREKTUR Doppelzahlung von ' + user;
        tmp.individuallyChanged = true;
        tmp.value = data.value * -1;
        tmp.type = data.type;
        tmp.remark = 'Korrektur Doppelzahlung vom ' + DateToStringShort(data.validFrom);
        data.remark = 'wurde Korrigiert am ' + DateToStringShort(new Date()) + ' von ' + user;
        data.individuallyChanged = true;
        this.updateJournal.emit(data);

        this.addJournal.emit(tmp);
      },
      () => { }
    );


  }

  onclickResetOverPayment(content, data: IJournal) {

    this.titleOverpayment = 'Überzahlung';
    this.messageOverpayment = 'Wollen sie die Überzahlung "' + data.name + '" rückgägig machen?';

    this.modalService.open(content, { size: 'sm', centered: true, windowClass: 'custom-class' }).result.then(
      () => {
        const tmp = new Journal();
        const user = localStorage.getItem(MessageLibrary.TOKEN_USERNAME);
        tmp.clientId = this.clientId;
        tmp.validFrom = dateWithLocalTimeCorrection(new Date());
        tmp.invoiceBase = data.invoiceBase;
        tmp.name = data.name;
        tmp.description = 'KORREKTUR Überzahlung von ' + user;
        tmp.individuallyChanged = true;
        tmp.value = data.value * -1;
        tmp.type = data.type;
        tmp.remark = 'Korrektur Überzahlung vom ' + DateToStringShort(data.validFrom);
        data.remark = 'wurde Korrigiert am ' + DateToStringShort(new Date()) + ' von ' + user;
        data.individuallyChanged = true;
        this.updateJournal.emit(data);

        this.addJournal.emit(tmp);
      },
      () => { }
    );



  }
}
