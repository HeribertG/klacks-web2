import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.scss']
})
export class InfoCardComponent  {

@Input() header: string='';
@Input() subTitle: string='';
@Input() value: number=0;

  constructor() { }


}
