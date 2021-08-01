import { Component, Input, OnInit } from '@angular/core';
import { MessageLibrary } from 'src/app/helpers/string-constants';



@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit {
  @Input() isDashboard: boolean= false;
  
  newEntries = 0;
  openEntries = 0;
  freePlaces = 0;

  constructor(
   
  ) { }

  ngOnInit(): void {
   

  }


}
