import { Holiday } from './holiday';

export class HolidaysList {

  private yearNumber: number = new Date(Date.now()).getFullYear();
  private weekDayName: string = "SOMODIMIDOFRSA";
  private list: Holiday[] = new Array<Holiday>();
  public holidayList: HolidayDate[] = new Array<HolidayDate>()

  public get CurrentYear(): number {
    return this.yearNumber;
  }
  public set CurrentYear(value: number) {
    this.yearNumber = value;
  }

  public add(Value: Holiday) {
    this.list.push(Value);
  }

  public remove(Index: number) {
    this.list.splice(Index, 1);
  }

  public item(Index: number): Holiday {
    return this.list[Index];
  }

  public count(): number {
    return this.list.length;
  }

  public computeHolidays() {

    if (this.list.length === 0) return;

    let easterDate: Date;
    let i: number;
    let w: string;

    easterDate = this.easter(this.CurrentYear);

    this.holidayList = [];

    for (let i = 0; i < this.count(); i++) {

      let item: Holiday = this.item(i)
      w = item.rule;
      let c = new HolidayDate();
      c.currentName = item.name;
      c.currentDate = this.convertDate(easterDate, this.CurrentYear, w);
      c.officially = item.officialHoliday;
      c.formatDate = this.formatDate(c.currentDate);

      if (!item.subRule) this.subRules(item.subRule, c);

      this.holidayList.push(c);
    }

    this.holidayList = this.holidayList.sort((a:HolidayDate, b:HolidayDate)=>{
      
      if (a.currentDate > b.currentDate) return 1;
      if (a.currentDate < b.currentDate) return -1;
      return 0;
    });
    
  }

  private subRules(rules: string, item: HolidayDate) {

    let i: number;
    let rule: string[];
    let zWtg: number;
    let aWtg: number;
    let nbr: number;

    rule = rules.split(";");

    for (i = 0; i < rule.length; i++) {

      aWtg = item.currentDate.getDay() + 1;
      zWtg = Math.ceil(this.weekDayName.indexOf(rule[i].substring(0, 2)) / 2) + 1;

      nbr = Number.parseInt(rule[i].substring(3, (rule[i].length - 3)));

      if (aWtg == zWtg && nbr > 0) {
        if (rule[i].substring(2, 1) == "+")
          item.currentDate = new Date(item.currentDate.getFullYear(), item.currentDate.getMonth(), item.currentDate.getDate() + nbr);
        else if (rule[i].substring(2, 1) == "-")
          item.currentDate = new Date(item.currentDate.getFullYear(), item.currentDate.getMonth(), item.currentDate.getDate() - nbr);
      }

    }

  }

  private easter(currentYear: number): Date {

    // Berechnung Osterdatum für das vorgegebene Jahr
    let CurrentDay: number;
    let CurrentMonth: number;
    let X1: number;
    let X2: number;
    let x3: number;
    let x4: number;
    let x5: number;

    X1 = (currentYear % 19);
    X2 = (currentYear % 4);
    x3 = (currentYear % 7);
    x4 = ((19 * X1 + 24) % 30);
    x5 = ((2 * X2 + 4 * x3 + 6 * x4 + 5) % 7);

    CurrentDay = (22 + x4 + x5);

    if (CurrentDay < 32)
      CurrentMonth = 3;
    else {

      CurrentDay = (x4 + x5 - 9);
      if (CurrentDay == 26 && x4 == 28 && x5 == 6 && X1 > 10) {
        CurrentDay = 18;
      }

      if (CurrentDay == 26) CurrentDay = 19;

      CurrentMonth = 4;
    }

    return new Date(currentYear, CurrentMonth - 1, CurrentDay);
  }

  public GetISO8601WeekNumber(date: Date): number {
    const JAN: number = 1;
    const DEC: number = 12;
    const LASTDAYOFDEC: number = 31;
    const FIRSTDAYOFJAN: number = 1;
    const THURSDAY: number = 4;
    let Week53Flag: boolean = false;

    // Get the day number since the beginning of the year
    let DayOfYear: number = this.daysIntoYear(new Date(date.getFullYear(), 12, 31));
    //  Get the numeric weekday of the first day of the
    //  year (using sunday as FirstDay)
    let StartWeekDayOfYear: number = (new Date(date.getFullYear(), JAN, FIRSTDAYOFJAN).getDay());
    let EndWeekDayOfYear: number = (new Date(date.getFullYear(), DEC, LASTDAYOFDEC).getDay());
    let DaysInFirstWeek: number = (8 - StartWeekDayOfYear);
    let DaysInLastWeek: number = (8 - EndWeekDayOfYear);

    if (StartWeekDayOfYear == THURSDAY || EndWeekDayOfYear == THURSDAY) {
      Week53Flag = true;
    }

    //  We begin by calculating the number of FULL
    //  weeks between the start of the year and
    //  our date. The number is rounded up, so the
    //  smallest possible value is 0.
    let FullWeeks: number = Math.ceil((DayOfYear - DaysInFirstWeek) / 7);
    let WeekNumber: number = FullWeeks;
    //  If the first week of the year has at least four days,
    //  then the actual week number for our date
    //  can be incremented by one.
    if ((DaysInFirstWeek >= THURSDAY)) {
      WeekNumber = (WeekNumber + 1);
    }

    //  If week number is larger than week 52 (and the year
    //  doesn't either start or end on a thursday)
    //  then the correct week number is 1.
    if (((WeekNumber > 52)
      && !Week53Flag)) {
      WeekNumber = 1;
    }

    //  If week number is still 0, it means that we are trying
    //  to evaluate the week number for a
    //  week that belongs in the previous year (since that week
    //  has 3 days or less in our date's year).
    //  We therefore make a recursive call using the last day of
    //  the previous year.
    if ((WeekNumber == 0)) {
      WeekNumber = this.GetISO8601WeekNumber(new Date((date.getFullYear() - 1), DEC, LASTDAYOFDEC));
    }

    return WeekNumber;
  }

  formatDate(date: Date): string {
    let currentDate: string = ''
    currentDate = date.toLocaleDateString('de-CH')


    return currentDate;
  }

  public isHolyday(currentDate: Date): number {

    if (this.holidayList == null) {
      return 0;
    }
    if (this.holidayList.length == 0) {
      return 0;
    }

    let holidayFound = this.holidayList.find(x => x.currentDate.getTime() === currentDate.getTime());

    if (holidayFound != undefined) {
      if (holidayFound.officially) return 2
      return 1
    }

    return 0;
  }

  public holydayInfo(currentDate: Date): HolidayDate | undefined {

    if (!this.holidayList) {
      return undefined;
    }
    if (this.holidayList.length == 0) {
      return undefined;
    }

    let holidayFound = this.holidayList.find(x => x.currentDate.getTime() === currentDate.getTime());
    return holidayFound;
  }

  private daysIntoYear(date: Date) {
    return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
  }

  private convertDate(easterDate: Date, currentYear: number, w: string): Date {
    // Umformen des Datumsstrings zu einem aktuellen Datum ---
    // es erfolgt keine Syntaxprüfung

    let calcDate: Date;
    let zWtg: number;
    let aWtg: number;
    let wAdd: string;
    let l: number;
    let diff: number;

    if (w.substring(0, 6) == "OSTERN") {

      let tmpDay: number = Number.parseInt(w.substring(6, 9))
      if (!Number.isNaN(tmpDay))
        calcDate = this.addDays(easterDate, tmpDay);
      else
        calcDate = easterDate;

      if ((w.length > 9)) {

        zWtg = Math.ceil(this.weekDayName.indexOf(w.substring(10, 2)) / 2) + 1;
        aWtg = calcDate.getDay() + 1;

        if (w.substring(9, 1) == "+") {
          diff = ((zWtg - aWtg) + 7);
        }
        else {
          diff = (zWtg - aWtg) - 7;
        }

        calcDate = this.addDays(calcDate, diff);
      }
    }
    else {
      const month: number = Number.parseInt(w.substring(0, 2))
      const day: number = Number.parseInt(w.substring(3, 5))
      calcDate = new Date(currentYear, month - 1, day);

      if ((w.length > 5)) {
        zWtg = Math.ceil(this.weekDayName.indexOf(w.substring(9, 11)) / 2) + 1;
        aWtg = calcDate.getDay() + 1;

        wAdd = w.substring(8, 9);

        if (zWtg != aWtg) {

          if (((w.substring(8, 9) == "+") || (wAdd == "&"))) {
            //  nächster ZielWochentag

            l = (zWtg - aWtg);
            calcDate = this.addDays(calcDate, l);;

            if ((l < 0)) calcDate = this.addDays(calcDate, 7);
            if ((wAdd == "&")) calcDate = this.addDays(calcDate, -7);
          }
          else {
            l = (aWtg - zWtg);
            if ((l < 0))
              calcDate = this.addDays(calcDate, (l * -1) + 7);
            else
              calcDate = this.addDays(calcDate, l * -1);
          }

        }
        calcDate = this.addDays(calcDate, Number.parseInt(w.substring(5, 8)));
      }

    }

    return calcDate;
  }

  private addDays(date: Date | string, days: number) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  public MaxDayYear(): number {
    return this.daysIntoYear(new Date(this.CurrentYear, 12, 31))

  }

  public CountMonthDays(CurrentMonth: number, CurrentYear: number): number {
    let i=-1;
    switch (CurrentMonth) {
      case 4:
        i = 30;
        break;
      case 6:
        i = 30;
        break;
      case 9:
        i = 30;
        break;
      case 11:
        i = 30;
        break;
      case 1:
        i = 31;
        break;
      case 3:
        i = 31;
        break;
      case 5:
        i = 31;
        break;
      case 7:
        i = 31;
        break;
      case 8:
        i = 31;
        break;
      case 10:
        i = 31;
        break;
      case 12:
        i = 31;
        break;
      case 2:
        let d: Date = new Date(this.CurrentYear, 3, 1);
        d = this.addDays(d, -1);
        i = d.getDate();
        break;
    }

    return i;
  }
}

export class HolidayDate {
  public currentDate: Date = new Date();
  public currentName: string = '';
  public officially: boolean = false;
  public formatDate: string = '';
}

