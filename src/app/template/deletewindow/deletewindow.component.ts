import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-deletewindow',
  templateUrl: './deletewindow.component.html',
  styleUrls: ['./deletewindow.component.scss']
})
export class DeletewindowComponent implements OnInit {
  @Input() title = 'Löschen';
  @Input() message: string='';
  constructor() { }

  ngOnInit(): void {
  }

}
