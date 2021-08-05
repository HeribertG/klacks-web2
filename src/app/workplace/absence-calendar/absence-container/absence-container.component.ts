import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-absence-container',
  templateUrl: './absence-container.component.html',
  styleUrls: ['./absence-container.component.scss']
})
export class AbsenceContainerComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output() horizontaleChangeEvent = new EventEmitter<Boolean>();
  @Output() verticaleChangeEvent = new EventEmitter<Boolean>();
  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {

  }

  
  ngOnDestroy() {
  }

  onHorizontaleChange() {
    this.horizontaleChangeEvent.emit(true);
  }
  onVerticaleChange() {
    this.verticaleChangeEvent.emit(true);
  }


}
