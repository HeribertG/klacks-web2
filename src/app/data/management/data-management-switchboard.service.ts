import { Injectable } from '@angular/core';
import { DataManagementEmployeeService } from './data-management-employee.service';

import { MessageLibrary } from 'src/app/helpers/string-constants';
import { EqualDate } from 'src/app/helpers/format-helper';
import { AuthService } from 'src/app/auth/auth.service';



@Injectable({
  providedIn: 'root'
})
export class DataManagementSwitchboardService {
  isFocused = '';
  isDirty = false;
  isDisabled = false;
  showProgressSpinner = false;
  isSavedOrReset = false;

  constructor(
    public dataManagementEmployeeService: DataManagementEmployeeService,
    private authService: AuthService,

  ) {
    const tmp = this.dataManagementEmployeeService.isF5ReRead.subscribe(() => {
      this.isFocused = 'DataManagementClientService';
      tmp.unsubscribe();
    });
  }


  areObjectsDirty() {

    this.checkObjectDirty();

  }

  checkIfDirtyIsNecessary() {

    if (this.isDirty && this.isSavedOrReset) {
      this.checkObjectDirty();
    }

    if (this.isDirty === false) {
      this.isSavedOrReset = false;
    }

  }

  private checkObjectDirty() {

    switch (this.isFocused) {

      case 'DataManagementClientService':
        this.isDirty = this.dataManagementEmployeeService.areObjectsDirty();
        break;
     default:
        this.isDirty = false;
        break;
    }

    if (this.isDirty === false) {
      this.isDisabled = false;
      this.showProgressSpinner = false;
    }
  }
  onClickSave(): void {
    if (localStorage.getItem(MessageLibrary.TOKEN) !== null) {
      const tokenDate = new Date(localStorage.getItem(MessageLibrary.TOKEN_EXP) as string);
      const currentDate = new Date();
      const res = EqualDate(currentDate, tokenDate);
      if (res <= 0) {

        this.authService.refreshToken().then(x => {
          if (x === true) {
            this.onSave();
          } else {
            this.authService.showInfo(MessageLibrary.EXPIRED_TOKEN);
            this.authService.logOut();
          }
        });
      }else {
        this.onSave();
      }
    }
  }

  private onSave(): void {

    switch (this.isFocused) {
      case 'DataManagementEmployeeService':
        this.isDisabled = true;
        this.showProgressSpinner = true;
        this.isSavedOrReset = true;
        this.dataManagementEmployeeService.save();

        break;
      }

  }

  reset() {
    switch (this.isFocused) {

      case 'DataManagementClientService':
        this.isSavedOrReset = true;
        this.dataManagementEmployeeService.resetData();
        break;
    }
  }



}
