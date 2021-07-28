import * as moment from 'moment';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { IOwnTime, OwnTime } from '../core/general-class';




export function EqualDate(firstDate: Date | string, secondDate: Date | string): number {

  const first = new Date(firstDate);

  const second = new Date(secondDate);

  return first > second ? -1 : first < second ? 1 : 0;
}


export function DateToString(date: Date | string): string {
  moment.locale('de');
  return moment(date).format('dddd DD.MM.yyyy');

}
export function DateToStringShort(date: Date | string): string {
  moment.locale('de');
  return moment(date).format('DD.MM.yyyy');

}


export function dateWithLocalTimeCorrection(date: Date | string | null): Date |null{
  if (date === null) { return null; }
  const userTimezoneOffset = moment(date).utcOffset();
  const hourDiff = userTimezoneOffset / 60;
  return new Date(moment(date).year(), moment(date).month(), moment(date).date(), hourDiff, 0, 0);
}

export function addMonths(date: Date, value: number): Date {

  const d = new Date(date);
  const n = date.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() + value);
  d.setDate(Math.min(n, getDaysInMonth(d.getFullYear(), d.getMonth())));
  return d;

  function isLeapYear(year:number):boolean {
    return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
  }

  function getDaysInMonth(year:number, month:number):number {
    return [31, (isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
  }
}

export function isNumeric(val: any): boolean {
  return !(val instanceof Array) && (val - parseFloat(val) + 1) >= 0;
}

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getFileExtension(fileName: string): string {

  return fileName.slice((Math.max(0, fileName.lastIndexOf('.')) || Infinity) + 1);
}

export function dateWithUTCCorrection(date: Date): Date|null {
  if (!date) {
    return null;
  }

  const d = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
  return new Date(d);
}



export function compareDate(a: Date, b: Date): boolean {
  if (a === null && b === null) {
    return true;
  }

  if (a.getFullYear() !== b.getFullYear()) {
    return false;
  }

  if (a.getMonth() !== b.getMonth()) {
    return false;
  }

  if (a.getDate() !== b.getDate()) {
    return false;
  }

  return true;
}

export function addDays(date: Date | string, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}


export function unformatPhoneNumber(value: string): string {
  const tmpValue = value.replace(/\D/g, '');

  return tmpValue;
}

export function formatPhoneNumber(value: string): string {
  const tmpValue = unformatPhoneNumber(value);

  return formatPhoneNumber13Digits(tmpValue);
}

export function newGuid(): string {
  // tslint:disable-next-line: only-arrow-functions
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {

    // tslint:disable-next-line: no-bitwise
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


function formatPhoneNumber13Digits(value: string): string {
  if (value.length === 0) {
    value = '';
  } else if (value.length <= 2) {
    value = value.replace(/^(\d{0,2})/, '$1');
  } else if (value.length <= 5) {
    value = value.replace(/^(\d{0,2})(\d{0,3})/, '$1 $2');
  } else if (value.length === 6) {
    value = value.replace(/^(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,1})/, '$1 $2 $3');
  } else if (value.length === 7) {
    value = value.replace(/^(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})/, '$1 $2 $3');
  } else if (value.length <= 9) {
    value = value.replace(/^(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})/, '$1 $2 $3 $4');
  } else if (value.length === 10) {
    value = value.replace(/^(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})(\d{0,1})/, '$1 $2 $3 $4 $5');
  } else if (value.length <= 11) {
    value = value.replace(/^(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})(\d{0,2})/, '$1 $2 $3 $4 $5');
  } else if (value.length === 12) {
    value = value.replace(
      /^(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})(\d{0,2})(\d{0,1})/,
      '$1 $2 $3 $4 $5 $6'
    );
  } else if (value.length <= 13) {
    value = value.replace(
      /^(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})(\d{0,2})(\d{0,2})/,
      '$1 $2 $3 $4 $5 $6'
    );
  } else {
    value = value.replace(
      /^(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})(\d{0,2})(\d{0,2})/,
      '$1 $2 $3 $4 $5 $6'
    );
  }
  return value;
}


export function transformNgbDateStructToDate(value: NgbDateStruct): Date | null {

  if (value) {
    if (typeof value === 'object' && (value.hasOwnProperty('year') && value.hasOwnProperty('month') && value.hasOwnProperty('day'))) {
      if (isYearOk(value.year!) && isMonhtOk(value.month!) && isDayhOk(value.day!)) {
        return new Date(value.year!, value.month! - 1, value.day);
      }
    }
  }
  return null;


}

export function transformDateToNgbDateStruct(value: Date | string): NgbDateStruct|undefined {
  if (value) {
    const now = new Date(value);
    return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
  }
  return undefined;
}

export function isNgbDateStructOk(event: NgbDateStruct): boolean {

  if (event) {
    if (typeof event === 'object' && (event.hasOwnProperty('year') && event.hasOwnProperty('month') && event.hasOwnProperty('day'))) {
      if (isYearOk(event.year!) && isMonhtOk(event.month!) && isDayhOk(event.day!)) {

        return true;


      }
    }
  }


  return false;


}


function isYearOk(value: number): boolean {
  if (value.toString().length < 2 || value.toString().length > 4) { return false; }
  return true;
}
function isMonhtOk(value: number): boolean {
  if (value < 1 || value > 12) { return false; }
  return true;
}
function isDayhOk(value: number): boolean {
  if (value < 1 || value > 31) { return false; }
  return true;
}



export function transformStringToOwnTime(value: string): IOwnTime| undefined {
  if (value) {
    const now = value.split(':');
    return new OwnTime(now[0], now[1]);
  }

  return undefined;
}
