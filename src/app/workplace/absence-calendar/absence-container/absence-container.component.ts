import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { DataManagementHolydayService } from 'src/app/data/management/data-management-holyday.service';
import { CalendarSetting } from '../absence-classes/calendar-setting';
import { CalendarData } from '../absence-classes/data-calendar';
import { ScrollCalendar } from '../absence-classes/scroll-calendar';

@Component({
  selector: 'app-absence-container',
  templateUrl: './absence-container.component.html',
  styleUrls: ['./absence-container.component.scss']
})
export class AbsenceContainerComponent implements OnInit, AfterViewInit, OnDestroy {
 
  private calendarSetting: CalendarSetting | undefined;
  public calendarData: CalendarData | undefined;
  public scrollCalendar: ScrollCalendar | undefined = new ScrollCalendar();
  
  constructor(private dataManagementHolydayService: DataManagementHolydayService) {
    this.calendarSetting = new CalendarSetting(dataManagementHolydayService);
    this.calendarData = new CalendarData(this.calendarSetting!);
  }

  ngOnInit(): void {
    this.calendarSetting!.currentYear = new Date().getFullYear();
  }

  ngAfterViewInit() {

  }

  
  ngOnDestroy() {
  }

 
}
