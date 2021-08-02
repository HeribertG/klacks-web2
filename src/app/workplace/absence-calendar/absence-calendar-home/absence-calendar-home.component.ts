import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-absence-calendar-home',
  templateUrl: './absence-calendar-home.component.html',
  styleUrls: ['./absence-calendar-home.component.scss']
})
export class AbsenceCalendarHomeComponent implements OnInit {
  @Input() isAbsenceCalendar: boolean = false;
  @Output() isChangingEvent = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit(): void {
  }

}
