import { AfterViewInit, Component, OnDestroy, OnInit, } from '@angular/core';
import { DataManagementHolydayService } from 'src/app/data/management/data-management-holyday.service';
import { CalendarSetting } from '../absence-classes/calendar-setting';
import { CalendarData } from '../absence-classes/data-calendar';
import { ScrollCalendar } from '../absence-classes/scroll-calendar';
import { Options } from '@angular-slider/ngx-slider';
import { DataManagementCalendarService } from 'src/app/data/management/data-management-calendar.service';

@Component({
  selector: 'app-absence-container',
  templateUrl: './absence-container.component.html',
  styleUrls: ['./absence-container.component.scss']
})
export class AbsenceContainerComponent implements OnInit, AfterViewInit, OnDestroy {

  searchString = '';

  value: number = 100;
  options: Options = {
    floor: 50,
    ceil: 300,
    showSelectionBarEnd: false,
    showSelectionBar: false


  };

  private calendarSetting: CalendarSetting | undefined;
  public calendarData: CalendarData | undefined;
  public scrollCalendar: ScrollCalendar | undefined = new ScrollCalendar();



  constructor(
    private dataManagementHolydayService: DataManagementHolydayService,
    public dataManagementCalendarService: DataManagementCalendarService) {
    this.calendarSetting = new CalendarSetting(dataManagementHolydayService);
    this.calendarData = new CalendarData(this.calendarSetting!, this.dataManagementCalendarService);
  }

  ngOnInit(): void {
    this.calendarSetting!.currentYear = new Date().getFullYear();
  }

  ngAfterViewInit() {

  }


  ngOnDestroy() {
  }

  onChange() {
    this.calendarSetting!.zoom = this.value / 100;
  }


  onOpenChange(event: boolean) {

  }

  onClickSearch() {

  }

  onKeyupSearch(event: any) {

    if (event.srcElement && event.srcElement.value.toString() === '') { this.onClickSearch(); }

  }



  onClick(event: MouseEvent) {
    setTimeout(()=> {
      const x= document.getElementById('search');
      x!.focus();
    }, 20);
     
  }
   
}
