import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { retry } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IHolydayRule } from '../core/holyday-rule';

@Injectable({
  providedIn: 'root'
})
export class DataHolydayRulesService {

  constructor(private httpClient: HttpClient) { }

  readHolydayRule(value: string): Observable<IHolydayRule> {
    return this.httpClient.get<IHolydayRule>(`${environment.baseUrl}Calendars/HolydayRule/` + value).pipe(retry(3));
  }

  updateHolydayRule(value: IHolydayRule) : Observable<IHolydayRule>{
    return this.httpClient.put<IHolydayRule>(`${environment.baseUrl}Calendars/HolydayRule/`, value).pipe(retry(3));
  }

  addHolydayRule(value: IHolydayRule) : Observable<IHolydayRule>{
    return this.httpClient.post<IHolydayRule>(`${environment.baseUrl}Calendars/HolydayRule/`, value).pipe(retry(3));
  }

  readHolydayRuleList(): Observable<IHolydayRule[]> {
    return  this.httpClient.get<IHolydayRule[]>(`${environment.baseUrl}Calendars/GetHolydayRuleList`).pipe(retry(3));
  }
}
