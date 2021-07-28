import { Component, OnInit, ViewChild, Output, EventEmitter, AfterViewInit, OnDestroy } from '@angular/core';
import { DataManagementEmployeeService } from 'src/app/data/management/data-management-employee.service';



@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit {

  @Output() isChangingEvent = new EventEmitter<boolean>();

  constructor(public dataManagementEmployeeService: DataManagementEmployeeService, ) { }

  ngOnInit(): void {
  }


  setName(index: number): string {
    return 'note' + index.toString();
  }

  onChange(index: number, event:any) {
    const txt = event.srcElement.value;
    this.dataManagementEmployeeService.editEmployee!.annotations[index].note = txt;
    this.isChangingEvent.emit(true);
  }

  onKeyUp(index: number, event:any) {

    event.cancelBubble = true;

    const txt = event.srcElement.value;
    this.dataManagementEmployeeService.editEmployee!.annotations[index].note = txt;
    this.isChangingEvent.emit(true);
  }


  newAnnotation() {
    this.dataManagementEmployeeService.addAnnotation();
  }

  onDeleteCurrentAnnotation() {
    this.dataManagementEmployeeService.removeCurrentAnnotation();
    this.isChangingEvent.emit(true);
  }

  onFocus(index: number) {

    this.dataManagementEmployeeService.currentAnnotationIndex = index;
  }


}
