import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-restorewindow',
  templateUrl: './restorewindow.component.html',
  styleUrls: ['./restorewindow.component.scss']
})
export class RestorewindowComponent implements OnInit {
  @Input() title = 'Reaktiveren';
  @Input() message: string='';
  constructor() { }

  ngOnInit(): void {
  }

}
