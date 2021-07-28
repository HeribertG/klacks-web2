import { Component, OnInit } from '@angular/core';
import { IEmployee } from 'src/app/core/employee-class';
import { DataManagementEmployeeService } from 'src/app/data/management/data-management-employee.service';
import { MessageLibrary } from 'src/app/helpers/string-constants';

@Component({
  selector: 'app-address-edit-nav',
  templateUrl: './address-edit-nav.component.html',
  styleUrls: ['./address-edit-nav.component.scss']
})
export class AddressEditNavComponent implements OnInit {

  constructor(public dataManagementEmployeeService: DataManagementEmployeeService,) { }

  ngOnInit(): void {
  }


 
  onClickAdressArray(index: number) {
    this.dataManagementEmployeeService.currentAddressIndex = index;
  }

  onClickPaginationButton(changeValue: number) {
    if (changeValue < 0) {
      if (this.dataManagementEmployeeService.findEmployeePage > 1) {
        this.dataManagementEmployeeService.findEmployeePage += changeValue;
        this.dataManagementEmployeeService.readActualSortedEmployeePage();
      }
    } else if (changeValue > 0) {
      if (this.dataManagementEmployeeService.findEmployeePage < this.dataManagementEmployeeService.findEmployeeMaxPages) {
        this.dataManagementEmployeeService.findEmployeePage += changeValue;
        this.dataManagementEmployeeService.readActualSortedEmployeePage();
      }
    }

  }

  onClickFindEmployee(value: IEmployee) {
    this.dataManagementEmployeeService.replaceEmployee(value.id!);

  }

  onClickReset() {
    this.dataManagementEmployeeService.resetFindEmployee();
  }

  isRestPossible(): boolean {
    if (this.dataManagementEmployeeService.backupFindEmployee) {
      return true;
    }
    return false;
  }
}
