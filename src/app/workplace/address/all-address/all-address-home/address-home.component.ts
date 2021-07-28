import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-address-home',
  templateUrl: './address-home.component.html',
  styleUrls: ['./address-home.component.scss']
})
export class AddressHomeComponent implements OnInit {


  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {



    window.addEventListener('scroll', this.scroll, true);


  }


  private scroll = (event:any): void => {
    // const navAddress = document.getElementById('nav');
   
    // const newpos = Math.round(944 - event.srcElement.scrollLeft);
    // this.renderer.setStyle(navAddress, 'left',  newpos.toString() );
    
    // const top = event.srcElement.scrollLeft;
    // console.log(event.srcElement.scrollLeft, newpos +'px');

  }

}
