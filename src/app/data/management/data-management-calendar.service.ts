import { EventEmitter, Injectable, Output } from '@angular/core';
import { Router } from '@angular/router';
import { IAbsenceReason, ICalendar } from 'src/app/core/calendar-class';
import { ToastService } from 'src/app/toast/toast.service';
import { DataAbsenceReasonService } from '../data-absence-reason.service';
import { DataCalendarService } from '../data-calendar.service';

@Injectable({
  providedIn: 'root'
})
export class DataManagementCalendarService {
  @Output() isResetEvent = new EventEmitter();
  @Output() isInitEvent = new EventEmitter();

  calendar: ICalendar[] = [];
  absenceReasons: IAbsenceReason[] = [];

  private isInit = false;
  private initCount = 0;

  constructor(
    public toastService: ToastService,
    private dataCalendarService: DataCalendarService,
    private dataAbsenceReasonService: DataAbsenceReasonService,
    private router: Router,
  ) { }

  /* #region   init */

  init() {
    // if (this.isInit === false) {
      this.initCount = 0;
      
      this.absenceReasons = [];
      this.dataAbsenceReasonService.readAbsenceReasonList().subscribe((x) => {
        this.absenceReasons = x;
        this.isInitFinished(1);
      });

      this.calendar = [];
      this.dataCalendarService.getCalendarList().subscribe((x) => {
        this.calendar = x;
        this.isInitFinished(1);
      });


      this.isInit = true;
    // }
  }

  private isInitFinished(hit: number): void {
    this.initCount += hit;
    if (this.initCount === 2) {

      this.isInitEvent.emit();
    }

  }
  /* #endregion   init */

  /* #region   list calendar */
  readList() {
    this.calendar = [];
    this.dataCalendarService.getCalendarList().subscribe((x) => {
      this.calendar = x;
      this.isResetEvent.emit();
    }
    );
  }
  /* #endregion   list calendar */
}
