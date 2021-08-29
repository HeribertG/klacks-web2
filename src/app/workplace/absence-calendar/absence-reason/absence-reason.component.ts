import { Component, OnInit } from '@angular/core';
import { IAbsenceReason } from 'src/app/core/calendar-class';
import { DataManagementCalendarService } from 'src/app/data/management/data-management-calendar.service';


@Component({
  selector: 'app-absence-reason',
  templateUrl: './absence-reason.component.html',
  styleUrls: ['./absence-reason.component.scss']
})
export class AbsenceReasonComponent implements OnInit {

  constructor(public dataManagementCalendarService: DataManagementCalendarService) { }

  ngOnInit(): void {
  }

  onColor(value: IAbsenceReason) : string{
    if( value && value.backgroundColor){  return value.backgroundColor;}
    return 'transparent'
  
  }
}
