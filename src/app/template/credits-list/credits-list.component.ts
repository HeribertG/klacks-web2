import { Component, EventEmitter, Inject, Input, LOCALE_ID, OnChanges, OnInit, Output } from '@angular/core';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Credit, ICredit } from 'src/app/core/journal-class';

import { dateWithLocalTimeCorrection, isNgbDateStructOk, transformDateToNgbDateStruct, transformNgbDateStructToDate } from 'src/app/helpers/format-helper';
import { MessageLibrary } from 'src/app/helpers/string-constants';

@Component({
  selector: 'app-credits-list',
  templateUrl: './credits-list.component.html',
  styleUrls: ['./credits-list.component.scss']
})
export class CreditsListComponent implements OnInit, OnChanges {

  @Input() isAuthorised: boolean;
  @Input() journalHeader: string;
  @Input() journalSum: number;
  @Input() journalCount: number;
  @Input() journalBases: ICredit[];
  @Input() journalRequiredPage: number;
  @Input() journalNumberOfItemsPerPage: number;
  @Input() clientId: string;
  @Output() pageChange = new EventEmitter<number>();
  @Output() addJournal = new EventEmitter<ICredit>();
  @Output() dowloadTestaHeft = new EventEmitter();

  newCorrectionFrom: NgbDateStruct = transformDateToNgbDateStruct(new Date());
  newCorrectionType = 0;
  newCorrectionValue = 0;
  newCorrectionRemark = '';

  originalIsAuthorised = false;

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

  isMinus(data: ICredit): number {
    if (data.value < 0) { return data.value * -1; }
    return null;
  }

  isPlus(data: ICredit): number {
    if (data.value >= 0) { return data.value; }
    return null;
  }

  onIsDisabled(): boolean {
    return this.newCorrectionFrom === undefined || this.newCorrectionFrom === null || this.newCorrectionValue <= 0 ||
      this.newCorrectionRemark === undefined || this.newCorrectionRemark === null || this.newCorrectionRemark === '';
  }

  onOpen(content) {
    this.newCorrectionFrom = transformDateToNgbDateStruct(new Date());
    this.newCorrectionType = 0;
    this.newCorrectionValue = 0;
    this.newCorrectionRemark = '';


    this.modalService.open(content, { size: 'sm', centered: true,windowClass: 'custom-class' }).result.then(
      () => {
        this.addCorrection();
      },
      () => { }
    );

  }

  private addCorrection() {
    if (isNgbDateStructOk(this.newCorrectionFrom) && this.newCorrectionValue > 0) {
      const tmp = new Credit();
      const user = localStorage.getItem(MessageLibrary.TOKEN_USERNAME);
      tmp.clientId = this.clientId;
      tmp.validFrom = dateWithLocalTimeCorrection(transformNgbDateStructToDate(this.newCorrectionFrom));
      tmp.name = this.newCorrectionRemark;
      tmp.description = 'KORREKTUR von ' + user;
      tmp.individuallyChanged = true;

      tmp.value = this.newCorrectionValue;

      this.addJournal.emit(tmp);
    }
  }

  onClickTestatHeft() {
    this.dowloadTestaHeft.emit();
  }
}
