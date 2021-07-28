import { Component, OnInit, ViewChild, Output, EventEmitter, AfterViewInit, OnDestroy } from '@angular/core';
import { DataManagementClientService } from 'src/app/data/management/data-management-client.service';


@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit {

  @Output() isChangingEvent = new EventEmitter<boolean>();

  constructor(public dataManagementClientService: DataManagementClientService, ) { }

  ngOnInit(): void {
  }


  setName(index: number): string {
    return 'note' + index.toString();
  }

  onChange(index: number, event) {
    const txt = event.srcElement.value;
    this.dataManagementClientService.editClient.annotations[index].note = txt;
    this.isChangingEvent.emit(true);
  }

  onKeyUp(index: number, event) {

    event.cancelBubble = true;

    const txt = event.srcElement.value;
    this.dataManagementClientService.editClient.annotations[index].note = txt;
    this.isChangingEvent.emit(true);
  }


  newAnnotation() {
    this.dataManagementClientService.addAnnotation();
  }

  onDeleteCurrentAnnotation() {
    this.dataManagementClientService.removeCurrentAnnotation();
    this.isChangingEvent.emit(true);
  }

  onFocus(index: number) {

    this.dataManagementClientService.currentAnnotationIndex = index;
  }


}
