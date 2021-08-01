import { Component, OnInit, Input, OnChanges, AfterViewInit, Renderer2, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { HeaderProperties, HeaderDirection } from 'src/app/core/headerProperties';
import { MessageLibrary } from 'src/app/helpers/string-constants';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InitFinished } from 'src/app/helpers/enums/client-enum';
import { measureTableHeight } from 'src/app/helpers/tableResize';



@Component({
  selector: 'app-change-list',
  templateUrl: './change-list.component.html',
  styleUrls: ['./change-list.component.scss'],
})
export class ChangeListComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
 

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private renderer: Renderer2,
  ) { }

  ngOnInit(): void {

 
  }

  ngAfterViewInit(): void {

  }


  ngOnDestroy(): void {

  }


  ngOnChanges(changes:any) {
   
  }

  
 

}
