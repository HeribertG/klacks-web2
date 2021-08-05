import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataManagementHolydayService } from 'src/app/data/management/data-management-holyday.service';
import { CalendarSetting } from '../absence-classes/calendar-setting';
import { CalendarData } from '../absence-classes/data-calendar';
import { ScrollCalendar } from '../absence-classes/scroll-calendar';

@Component({
  selector: 'app-absence-body-container',
  templateUrl: './absence-body-container.component.html',
  styleUrls: ['./absence-body-container.component.scss']
})
export class AbsenceBodyContainerComponent implements OnInit {

  private calendarSetting: CalendarSetting | undefined;
  public calendarData: CalendarData | undefined;
  public scrollCalendar: ScrollCalendar | undefined = new ScrollCalendar();

  @Output() horizontaleChange = new EventEmitter();
  @Output() verticaleChange = new EventEmitter();
  @Input() horizontChanged: Promise<Boolean> | undefined;

  constructor(private dataManagementHolydayService: DataManagementHolydayService) {
    this.calendarSetting = new CalendarSetting(dataManagementHolydayService);
    this.calendarData = new CalendarData(this.calendarSetting!);
  }

  ngOnInit(): void {
    this.calendarSetting!.currentYear = new Date().getFullYear();

    this.horizontChanged!.then(()=>{
this.horizontaleChange.emit();
    });
  }

  onHorizontaleChange() {
    this.horizontaleChange.emit();
  }
  onVerticaleChange() {
    this.verticaleChange.emit();
  }

}
