import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ICalendar, ICalendarFilter } from '../core/calendar-class';
@Injectable({
  providedIn: 'root'
})
export class DataCalendarService {

  constructor(private httpClient: HttpClient) {}  
  
  readCalendarList(value:ICalendarFilter) {
    return this.httpClient.post<ICalendar[]>(
      `${environment.baseUrl}Calendars/CalendarList`,value).pipe();
  }
}
