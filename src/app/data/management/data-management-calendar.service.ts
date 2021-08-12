import { EventEmitter, Injectable, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ICalendar } from 'src/app/core/calendar-class';
import { ToastService } from 'src/app/toast/toast.service';
import { DataCalendarService } from '../data-calendar.service';

@Injectable({
  providedIn: 'root'
})
export class DataManagementCalendarService {
  @Output() isReset = new EventEmitter();

  calendar: ICalendar[]=[];

  constructor(
    public toastService: ToastService,
    private dataCalendarService: DataCalendarService,
    private router: Router,
  ) { }

  /* #region   list calendar */
  readList() {
    this.calendar =[];
   this.dataCalendarService.getCalendarList().subscribe((x)=>{
    this.calendar =x;
    this.isReset.emit();
   }
   );
  }
  /* #endregion   list calendar */
}
