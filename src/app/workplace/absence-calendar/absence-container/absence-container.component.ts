import { AfterViewInit, Component, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-absence-container',
  templateUrl: './absence-container.component.html',
  styleUrls: ['./absence-container.component.scss']
})
export class AbsenceContainerComponent implements OnInit, AfterViewInit, OnDestroy {
  
  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
 
  }

  ngOnDestroy() {

  }

  onResize() {



  }

}
