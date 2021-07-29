import { Component, OnInit, EventEmitter, Output, HostListener, Input } from '@angular/core';
import { DataManagementSwitchboardService } from 'src/app/data/management/data-management-switchboard.service';
import { DataManagementEmployeeService } from 'src/app/data/management/data-management-employee.service';
import { Router } from '@angular/router';
import { MessageLibrary } from 'src/app/helpers/string-constants';


@Component({
  selector: 'app-address-edit-home',
  templateUrl: './address-edit-home.component.html',
  styleUrls: ['./address-edit-home.component.scss']
})
export class AddressEditHomeComponent implements OnInit {
  @Input() isEditAddress: boolean= false;
  @Output() isChangingEvent = new EventEmitter();
  @Output() isEnterEvent = new EventEmitter();

  @HostListener('keyup', ['$event']) onkeyup(event: KeyboardEvent) {

    if (event.key === 'Enter') {

      if (this.dataManagementEmployeeService.areObjectsDirty()) { this.isEnterEvent.emit(); }

    }
  }

  constructor(

    public dataManagementSwitchboardService: DataManagementSwitchboardService,
    public dataManagementEmployeeService: DataManagementEmployeeService,
    private router: Router,

  ) { }

  ngOnInit(): void {

    if (this.dataManagementEmployeeService.editEmployee === undefined) {

      const tmpurl = this.router.url;
      const res = tmpurl.replace('?id=', ';').split(';');
      if (res.length === 2 && res[0] === '/workplace/edit-address') {
        this.dataManagementEmployeeService.readEmployee(res[1]);
        return;
      }
    }

    if (this.dataManagementEmployeeService.editEmployee === undefined) {

      const routerToken = localStorage.getItem(MessageLibrary.ROUTER_TOKEN) === null ?
        '' : localStorage.getItem(MessageLibrary.ROUTER_TOKEN);

      if (routerToken !== '') {
        this.router.navigate([routerToken]);
      }
    }

    this.dataManagementSwitchboardService.isFocused = 'DataManagementEmployeeService';

  }

  onIsChanging(event:boolean) {
    this.isChangingEvent.emit(event);
  }



}
