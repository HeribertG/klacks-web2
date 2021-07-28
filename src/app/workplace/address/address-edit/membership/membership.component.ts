import { Component, OnInit, IterableDiffers, OnDestroy, AfterViewInit, ViewChild, Output, EventEmitter, NgZone } from '@angular/core';
import { DataManagementEmployeeService } from 'src/app/data/management/data-management-employee.service';
import { NgForm } from '@angular/forms';
 
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageLibrary } from 'src/app/helpers/string-constants';



@Component({
  selector: 'app-membership',
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.scss']
})
export class MembershipComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('membershipForm', { static: false }) membershipForm: NgForm|undefined;
  @Output() isChangingEvent = new EventEmitter<boolean>();



  isAuthorised = false;

  now = new Date();

  objectForUnsubscribe: any;

  iterableDiffer: any;



  constructor(
    public dataManagementEmployeeService: DataManagementEmployeeService,
    private modalService: NgbModal,
    private iterableDiffers: IterableDiffers
  ) { this.iterableDiffer = iterableDiffers.find([]).create(undefined); }


  ngOnInit(): void {


  }

  ngAfterViewInit(): void {
    this.objectForUnsubscribe = this.membershipForm!.valueChanges!.subscribe(() => {

      if (this.membershipForm!.dirty === true) {
        setTimeout(() => this.isChangingEvent.emit(true), 100);

      }

    });

    if (localStorage.getItem(MessageLibrary.TOKEN_AUTHORISED)) {
      this.isAuthorised = JSON.parse(localStorage.getItem(MessageLibrary.TOKEN_AUTHORISED) as string);
    }
  }




  ngOnDestroy(): void {
    if (this.objectForUnsubscribe) { this.objectForUnsubscribe.unsubscribe(); }

  }

  
  onChangeDateBack(event:any) {

    if (event) {
      if (typeof event === 'object' && (event.hasOwnProperty('year') && event.hasOwnProperty('month') && event.hasOwnProperty('day'))) {
        if (event.year.toString().lenght === 4 && event.month.toString().lenght === 2 && event.day.toString().lenght === 2) {
          return new Date(event.year, event.month - 1, event.day);
        }
        return event;
      } else {
        return event;
      }
    }
    return null;
  }

  openCredits(content:any) {

     


    this.modalService.open(content, { size: 'lg', centered: true }).result.then(
      () => {
        // this.onDeleteCurrentAddress();
      },
      () => { }
    );

  }

}
