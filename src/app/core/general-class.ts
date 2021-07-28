
export interface IBaseEntity {

    createTime: Date | null;
    currentUserCreated: string | null;
    updateTime: Date | null;
    currentUserUpdated: string | null;
    isDeleted: boolean;
    deletedTime: Date | null;
    currentUserDeleted: string | null;

}

export class BaseEntity implements IBaseEntity {
    isDeleted = false;
    createTime = null;
    currentUserCreated = null;
    updateTime = null;
    currentUserUpdated = null;
    deletedTime = null;
    currentUserDeleted = null;
}

export interface IBaseFilter {
  searchString: | string | null;
  orderBy: string;
  sortOrder: string;
  numberOfItemsPerPage: number;
  requiredPage: number;
  firstItemOnLastPage: number | null;
  numberOfItemOnPreviousPage: number | null;
  isPreviousPage: boolean | null;
  isNextPage: boolean | null;
}

export class BaseFilter implements IBaseFilter {
  searchString = '';
  orderBy = 'name';
  sortOrder = 'asc';
  numberOfItemsPerPage = 0;
  requiredPage = 0;
  numberOfItemOnPreviousPage: number | null = null;
  firstItemOnLastPage: number | null = null;
  isPreviousPage: boolean | null = null;
  isNextPage: boolean | null = null;
}


export interface IBaseTruncated {
  maxItems: number;
  maxPages: number;
  currentPage: number;
  firstItemOnPage: number;
}

export class BaseTruncated implements IBaseTruncated {
  maxItems = 0;
  maxPages = 0;
  currentPage = 1;
  firstItemOnPage = 0;
}

export interface IStandartType extends IBaseEntity {
  id: string | null;
  name: string;
  position: number;

}

export class StandartType extends BaseEntity implements IStandartType {
  id = null;
  name = '';
  position = 0;

}

export interface IBaseOptionFilter {

  id: string | null;
  name: string | null;
  content: string | null;
  select: boolean | null;
  isEmptyStatus: boolean | null;
}

export class BaseOptionFilter implements IBaseOptionFilter {
  id = null;
  name = null;
  content = null;
  select = null;
  isEmptyStatus = null;
}

export interface IOwnTime {
  hours: string | null;
  minutes: string | null;
}

export class OwnTime implements IOwnTime {

  private pHours = '00';
  private pMinutes = '00';
  constructor(hours: string, minutes: string) {
    this.hours = hours;
    this.minutes = minutes;
  }
  get hours(): string {
    return this.pHours;
  }

  set hours(hours: string) {
    this.pHours = this.formatHours(hours);
  }
  get minutes(): string {
    return this.pMinutes;
  }

  set minutes(minutes: string) {
    this.pMinutes = this.formatMinutes(minutes);
  }

  public toString(): string {
    return this.pHours + ':' + this.pMinutes + ':00';
  }

  private formatHours(value: string): string {

    value = value.replace(/\D/g, '');

    if (value.length === 0) {
      value = '00';

    } else if (value.length === 1) {
      value = '0' + value;
      value = value.replace(/^(\d{0,2})/, '$1');
    } else if (value.length >= 2) {
      if (+value > 23) { value = '23'; }
      if (value.length === 3) { value = value.substring(1); }

      value = value.replace(/^(\d{0,2})/, '$1');
    }

    return value;
  }

  private formatMinutes(value: string): string {

    value = value.replace(/\D/g, '');

    if (value.length === 0) {
      value = '00';

    } else if (value.length === 1) {
      value = '0' + value;
      value = value.replace(/^(\d{0,2})/, '$1');
    } else if (value.length >= 2) {
      if (+value > 59) { value = '59'; }
      if (value.length === 3) { value = value.substring(1); }

      value = value.replace(/^(\d{0,2})/, '$1');
    }

    return value;
  }
}