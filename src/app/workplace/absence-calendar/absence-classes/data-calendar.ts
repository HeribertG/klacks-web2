import { EventEmitter, Injectable, Output } from "@angular/core";
import { DataManagementCalendarService } from "src/app/data/management/data-management-calendar.service";
import { CalendarSetting } from "./calendar-setting";



@Injectable({
  providedIn: 'any'
})
export class CalendarData {
  @Output() isResetEvent = new EventEmitter();
  @Output() isSelectRowEvent = new EventEmitter<number>();

  weekday = new Array(7);
  monthsName = new Array(12);
  calendarSetting: CalendarSetting | undefined;


  private rowsNumber = 100;
  private colsNumber = 366;

  backGroundColor = '#FFFFFF';
  backGroundColorSaturday = 'Beige';
  backGroundColorSunday = 'BlanchedAlmond';
  backGroundColorHolyday = '#e6ffe6';
  backGroundColorOfficiallyHolyday = '#ffffe6';

  constructor(
    calendarSetting: CalendarSetting,
    private dataManagementCalendarService: DataManagementCalendarService
  ) {

    this.dataManagementCalendarService.readList();
    this.calendarSetting = calendarSetting;
    const tmpDate = new Date(Date.now());
    const d = new Date(tmpDate.getFullYear(), 1, 1);
    const d2 = new Date(tmpDate.getFullYear(), 12, 31);



    this.weekday[0] = 'So';
    this.weekday[1] = 'Mo';
    this.weekday[2] = 'Di';
    this.weekday[3] = 'Mi';
    this.weekday[4] = 'Do';
    this.weekday[5] = 'Fr';
    this.weekday[6] = 'Sa';

    this.monthsName[0] = 'Januar';
    this.monthsName[1] = 'Februar';
    this.monthsName[2] = 'März';
    this.monthsName[3] = 'April';
    this.monthsName[4] = 'Mai';
    this.monthsName[5] = 'Juni';
    this.monthsName[6] = 'Juli';
    this.monthsName[7] = 'August';
    this.monthsName[8] = 'September';
    this.monthsName[9] = 'Oktober';
    this.monthsName[10] = 'November';
    this.monthsName[11] = 'Dezember';


    this.dataManagementCalendarService.isReset.subscribe(() => {
      this.resetRowsNumber(this.dataManagementCalendarService.calendar.length);
      this.isResetEvent.emit();
    });
  }

  destroy(): void {
    this.monthsName = [];
    this.weekday = [];
    this.calendarSetting = undefined;

  }



  resetRowsNumber(value: number): void {
    this.rowsNumber = value;
  }




  get rows(): number {
    return this.rowsNumber;
  }

  get columns(): number {
    return this.colsNumber;
  }

  readname(index: number): string {
    const data = this.dataManagementCalendarService.calendar[index];
    if (data) { return data.firstName + ' ' + data.name; }
    return '';
  }


  set selectRow(value: number) {
    this.isSelectRowEvent.emit(value);
  }
}
