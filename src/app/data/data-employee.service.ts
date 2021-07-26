import { Injectable } from '@angular/core';
import { retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';


import {
  unformatPhoneNumber,
  transformNgbDateStructToDate,
  isNgbDateStructOk,
  dateWithLocalTimeCorrection
} from '../helpers/format-helper';
import { FilterHistory, IAddress, ICommunicationType, IEmployee, IFilterEmployee, ITruncatedEmployee, ITruncatedHistory } from '../core/employee-class';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';


@Injectable({
  providedIn: 'root'
})
export class DataEmployeeService {

  constructor(private httpClient: HttpClient) { }

  
  readEmployeeList(filter: IFilterEmployee) {

    this.setCorrectDatFilter(filter);



    return this.httpClient
      .post<ITruncatedEmployee>(
        `${environment.baseUrl}Employees/GetSimpleList`, filter
      )
      .pipe(retry(3));
  }

  readChangeList(filter: IFilterEmployee) {
    return this.httpClient
      .post<ITruncatedEmployee>(
        `${environment.baseUrl}Employees/ChangeList`, filter
      )
      .pipe(retry(3));
  }

  getEmployee(id: string) {
    return this.httpClient
      .get<IEmployee>(
        `${environment.baseUrl}Employees/` + id
      )
      .pipe(retry(3));
  }

  findEmployee( name: string, firstName: string ) {
    return this.httpClient
      .get<IEmployee[]>(
        `${environment.baseUrl}Employees/FindEmployee/${name}/${firstName}/`
      )
      .pipe(retry(3));
  }


  updateEmployee(
    value: IEmployee
  ) {

    this.setCorrectDate(value);
    this.UnformatPhoneNumber(value);
 
    return this.httpClient
      .put<IEmployee>(
        `${environment.baseUrl}Employees/`,
        value
      )
      .pipe(retry(3));
  }

  addEmployee(
    value: IEmployee
  ) {

    this.setCorrectDate(value);
    this.UnformatPhoneNumber(value);
    

    return this.httpClient
      .post<IEmployee>(
        `${environment.baseUrl}Employees/`,
        value
      )
      .pipe(retry(3));
  }

  deleteEmployee(id: string) {
    return this.httpClient
      .delete<IEmployee>(
        `${environment.baseUrl}Employees/` + id
      )
      .pipe(retry(3));

  }

  readCommunicationTypeList() {
    return this.httpClient
      .get<ICommunicationType[]>(
        `${environment.baseUrl}Communications/CommunicationTypes/`)
      .pipe(retry(3));
  }

  

  readEmployeeaddressList(id: string) {
    return this.httpClient
      .get<IAddress[]>(
        `${environment.baseUrl}Addresses/EmployeeAddressList/` + id
      )
      .pipe(retry(3));

  }

  countNewEntries() {

    const now = new Date();
    const month = now.getMonth();
    const year = now.getUTCFullYear();
    const str = `${year}-${month + 1}-${1}`;
    const from = new Date(str).toUTCString();

    return this.httpClient
      .get<number>(
        `${environment.baseUrl}Employees/NewEntries/` + from,

      )
      .pipe(retry(3));
  }

  readHistoryList(filter: FilterHistory) {
    return this.httpClient
      .post<ITruncatedHistory>(
        `${environment.baseUrl}Employees/History/`, filter)
      .pipe(retry(3));
  }


  private setCorrectDatFilter(value: IFilterEmployee) {
    if (isNgbDateStructOk(value.internalScopeFrom as NgbDateStruct )) {
      value.scopeFrom = dateWithLocalTimeCorrection(transformNgbDateStructToDate(value.internalScopeFrom as NgbDateStruct ));
    } else {
      value.scopeFrom = null;
    }

    if (isNgbDateStructOk(value.internalScopeUntil as NgbDateStruct )) {
      value.scopeUntil = dateWithLocalTimeCorrection(transformNgbDateStructToDate(value.internalScopeUntil as NgbDateStruct ));
    } else {
      value.scopeUntil = null;
    }
  }

  private setCorrectDate(value: IEmployee) {

    if (isNgbDateStructOk(value.internalBirthdate as NgbDateStruct )) {
      value.birthdate = dateWithLocalTimeCorrection(transformNgbDateStructToDate(value.internalBirthdate as NgbDateStruct ));
    } else {
      value.birthdate = null;
    }

    if (isNgbDateStructOk(value.staff!.internalValidFrom as NgbDateStruct )) {
      value.staff!.validFrom = dateWithLocalTimeCorrection(transformNgbDateStructToDate(value.staff!.internalValidFrom as NgbDateStruct ));
    }
    if (isNgbDateStructOk(value.staff!.internalValidUntil as NgbDateStruct )) {
      value.staff!.validUntil = dateWithLocalTimeCorrection(transformNgbDateStructToDate(value.staff!.internalValidUntil  as NgbDateStruct ));
    } else {
      value.staff!.validUntil = null;
    }


    value.addresses.forEach(x => {
      x.validFrom = dateWithLocalTimeCorrection(x.validFrom);

    });

  

  }
 
  
  
  private UnformatPhoneNumber(value: IEmployee) {

    for (let i = value.communications.length - 1; i > -1; i--) {
      const x = value.communications[i];

      if (x.isPhone) {
        x.value = unformatPhoneNumber(x.value);
      }
    }
  }

}
