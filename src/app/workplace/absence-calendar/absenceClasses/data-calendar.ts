import { WeekDay } from "@angular/common";



export class CalendarData {

  weekday = new Array(7);
  monthsName = new Array(12);


  private rowsNumber = 100;
  private colsNumber = 366;

  backGroundColor = '#FFFFFF';
  backGroundColorSaturday = 'Beige';
  backGroundColorSunday = 'BlanchedAlmond';
  backGroundColorHolyday = '#e6ffe6';
  backGroundColorOfficiallyHolyday = '#ffffe6';

  constructor() {
   
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

    this.monthsName[0] = 'Jan';
    this.monthsName[1] = 'Feb';
    this.monthsName[2] = 'Mär';
    this.monthsName[3] = 'Apr';
    this.monthsName[4] = 'Mai';
    this.monthsName[5] = 'Jun';
    this.monthsName[6] = 'Jul';
    this.monthsName[7] = 'Aug';
    this.monthsName[8] = 'Sep';
    this.monthsName[9] = 'Okt';
    this.monthsName[10] = 'Nov';
    this.monthsName[1] = 'Dec';

  }

  destroy(): void {
    this.monthsName = [];
    this.weekday = [];

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

  

}
