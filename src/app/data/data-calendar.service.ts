import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { retry } from 'rxjs/operators';
import { ICalendar } from '../core/calendar-class';
@Injectable({
  providedIn: 'root'
})
export class DataCalendarService {

  constructor(private httpClient: HttpClient) {}  
  
  getCalendarList() {
    return this.httpClient.get<ICalendar[]>(
      `${environment.baseUrl}Calendars/GetCalendarList`).pipe();
  }
}
