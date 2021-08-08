import { Component, Input, OnInit, Output } from '@angular/core';
import { CalendarData } from '../absence-classes/data-calendar';
import { ScrollCalendar } from '../absence-classes/scroll-calendar';

@Component({
  selector: 'app-absence-body-container',
  templateUrl: './absence-body-container.component.html',
  styleUrls: ['./absence-body-container.component.scss']
})
export class AbsenceBodyContainerComponent implements OnInit {

  @Input() public calendarData: CalendarData | undefined;
  @Input() public scrollCalendar: ScrollCalendar | undefined;

 

  constructor() {
   
  }

  ngOnInit(): void {
    
  }


}
