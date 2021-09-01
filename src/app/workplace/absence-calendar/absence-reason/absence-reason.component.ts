import { Component, OnInit } from '@angular/core';
import { IAbsenceReason } from 'src/app/core/calendar-class';
import { DataManagementCalendarService } from 'src/app/data/management/data-management-calendar.service';


@Component({
  selector: 'app-absence-reason',
  templateUrl: './absence-reason.component.html',
  styleUrls: ['./absence-reason.component.scss']
})
export class AbsenceReasonComponent implements OnInit {
  dragging: any;


  constructor(public dataManagementCalendarService: DataManagementCalendarService) { }

  ngOnInit(): void {


  }

  onColor(value: IAbsenceReason): string {
    if (value && value.backgroundColor) { return value.backgroundColor; }
    return 'transparent'

  }


  // dragStart(event: DragEvent, item: any):void {
  //   event.dataTransfer!.setData('text', item.text);
  //   event.dataTransfer!.effectAllowed = 'move';
  //   this.dragging = item;
  // };

  // dragEnd(event: DragEvent, item: any) {
  //   this.dragging = undefined;
  // };

  allowDrop(ev: any) {
    ev.preventDefault();
  }

  drag(ev: any) {
    ev.dataTransfer.setData("text", ev.target.id);
  }

  drop(ev: any) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
  }


}
