import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { IAbsenceReason } from '../core/calendar-class';
import { retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataAbsenceReasonService {

  constructor(private httpClient: HttpClient) { }


  readAbsenceReason(value: string): Observable<IAbsenceReason> {
    return this.httpClient.get<IAbsenceReason>(`${environment.baseUrl}Options/AbsenceReason/` + value).pipe(retry(3));
  }

  updateAbsenceReason(value: IAbsenceReason) : Observable<IAbsenceReason>{
    return this.httpClient.put<IAbsenceReason>(`${environment.baseUrl}Options/AbsenceReason/`, value).pipe(retry(3));
  }

  addAbsenceReason(value: IAbsenceReason) : Observable<IAbsenceReason>{
    return this.httpClient.post<IAbsenceReason>(`${environment.baseUrl}Options/AbsenceReason/`, value).pipe(retry(3));
  }

  readAbsenceReasonList(): Observable<IAbsenceReason[]> {
    return  this.httpClient.get<IAbsenceReason[]>(`${environment.baseUrl}Options/AbsenceReason`).pipe(retry(3));
  }

  deleteAbsenceReason(id: string) {
    return this.httpClient.delete<IAbsenceReason>(`${environment.baseUrl}Options/AbsenceReason/` + id).pipe(retry(3));
  }

}
