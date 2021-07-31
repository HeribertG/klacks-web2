import { Injectable } from '@angular/core';
import { DataManagementEmployeeService } from './data-management-employee.service';

import { MessageLibrary } from 'src/app/helpers/string-constants';
import { EqualDate } from 'src/app/helpers/format-helper';
import { AuthService } from 'src/app/auth/auth.service';
import { DataManagementProfileService } from './data-management-profile.service';
import { DataManagementSettingsService } from './data-management-settings.service';



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
    public dataManagementProfileService: DataManagementProfileService,
    public dataManagementSettingsService: DataManagementSettingsService,
    public dataManagementEmployeeService: DataManagementEmployeeService,
    private authService: AuthService,

  ) {
    const tmp = this.dataManagementEmployeeService.isF5ReRead.subscribe(() => {
      this.isFocused = 'DataManagementEployeeService';
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
      case 'DataManagementSettingsService':
        this.isDirty = this.dataManagementSettingsService.areObjectsDirty();
        break;
      case 'DataManagementProfileService':
        this.isDirty = this.dataManagementProfileService.areObjectsDirty();
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
      } else {
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
      case 'DataManagementSettingsService':
        this.isDisabled = true;
        this.showProgressSpinner = true;
        this.isSavedOrReset = true;
        this.dataManagementSettingsService.save();
        break;
      case 'DataManagementProfileService':
        this.isDisabled = true;
        this.showProgressSpinner = true;
        this.isSavedOrReset = true;
        this.dataManagementProfileService.save();
        break;
    }

  }

  reset() {
    switch (this.isFocused) {

      case 'DataManagementClientService':
        this.isSavedOrReset = true;
        this.dataManagementEmployeeService.resetData();
        break;
      case 'DataManagementSettingsService':
        this.isSavedOrReset = true;
        this.dataManagementSettingsService.resetData();
        break;
      case 'DataManagementProfileService':
        this.isSavedOrReset = true;
        this.dataManagementProfileService.readData();
        break;
    }
  }



}
