import { Component, HostListener, Input, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-address-home',
  templateUrl: './address-home.component.html',
  styleUrls: ['./address-home.component.scss']
})
export class AddressHomeComponent implements OnInit {

  @Input() isAllAddress: boolean= false;
  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {


  }


  

}
