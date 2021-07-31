import { EventEmitter, Injectable, Output } from '@angular/core';
import { cloneObject, compareComplexObjects } from '../../helpers/object-helpers';
import { MessageLibrary } from '../../helpers/string-constants';
import { ToastService } from '../../toast/toast.service';
import { UserAdministrationService } from '../user-administration.service';
import { IAuthentication, Authentication, ChangePassword, ChangeRole } from '../../core/authentification-class';
import { DataSettingsVariousService } from '../data-settings-various.service';
import { ISetting, AppSetting, Setting,  } from 'src/app/core/settings-various-class';
import { ICountry } from 'src/app/core/employee-class';
import { DataCountryStateService } from '../data-country-state.service';
import { CreateEntriesEnum } from 'src/app/helpers/enums/client-enum';




@Injectable({
  providedIn: 'root',
})
export class DataManagementSettingsService {
  @Output() isReset = new EventEmitter();

  accountsList: IAuthentication[] = [];
  accountsListDummy: IAuthentication[] = [];
  accountCount = 0;

  CurrentAccoutId = '';

  countriesList: ICountry[]=[];
  countriesListDummy: ICountry[]=[];
  countriesListCount = 0;

  appName = '';
  appAddressName = '';
  appSupplementAddress = '';
  appAddressAddress = '';
  appAddressZip = '';
  appAddressPlace = '';
  appAddressPhone = '';
  appAddressMail = '';
  appAddressAccountingStart = 0;


  appNameDummy = '';
  appAddressNameDummy = '';
  appSupplementAddressDummy = '';
  appAddressAddressDummy = '';
  appAddressZipDummy = '';
  appAddressPlaceDummy = '';
  appAddressPhoneDummy = '';
  appAddressMailDummy = '';
  appAddressAccountingStartDummy = 0;

  

  settingList: ISetting[] = [];
  settingsCount = 0;

  isDirty = false;

  constructor(

    public userAdministrationService: UserAdministrationService,
    public dataSettingsVariousService: DataSettingsVariousService,
    public dataCountryStateService: DataCountryStateService,
    public toastService: ToastService,


  ) { }


  /* #region  UserAdministration */

  readAccountsList() {
    this.userAdministrationService
      .readAccountsList()
      .subscribe((x) => {
        if (x) {
          this.accountsList = x as IAuthentication[];
          this.accountsList.sort(compare);
          function compare(a: IAuthentication, b: IAuthentication) {

            const tmpa = a.lastName + ' ' + a.firstName;
            const tmpb = b.lastName + ' ' + b.firstName;
            return tmpa.localeCompare(tmpb);
          }
        }

        this.accountsListDummy = cloneObject(
          this.accountsList
        );

        this.isReset.emit();

      });
  }

  private countActionAccount(action: boolean) {
    if (action) {
      this.accountCount++;
    } else {
      this.accountCount--;
    }
    if (this.accountCount === 0) {
      setTimeout(() => {
        this.readAccountsList();
        this.IfStorageIsSuccessful();
      }, 200);

    }

  }

  addAccount(value: IAuthentication) {
    this.userAdministrationService.addAccount(value).subscribe(x => {

      this.showInfo(MessageLibrary.REGISTER, 'REGISTER');
      this.readAccountsList();
    });
  }

  deleteAccount(id: string) {
    this.userAdministrationService.deleteAccount(id).subscribe(x => {
      this.readAccountsList();
    });
  }

  saveAccountsRole() {
    this.accountCount = 0;

    this.accountsList.forEach(x => {
      this.changeRoleAdmin(x);
      this.changeRoleAuthorised(x);
    });

  }

  private changeRoleAdmin(value: IAuthentication) {

    this.countActionAccount(true);
    const c = new ChangeRole();

    c.userId = value.id!;
    c.roleName = 'Admin';
    c.isSelected = value.isAdmin;

    this.userAdministrationService
      .changeRole(c)
      .subscribe((x) => {
        if (x) { this.countActionAccount(false); }

      });

  }

  private changeRoleAuthorised(value: IAuthentication) {

    this.countActionAccount(true);
    const c = new ChangeRole();

    c.userId = value.id!;
    c.roleName = 'Authorised';
    c.isSelected = value.isAuthorised;

    this.userAdministrationService
      .changeRole(c)
      .subscribe((x) => {
        this.countActionAccount(false);
      });

  }

  private isAccountsList_Dirty(): boolean {
    const listOfExcludedObject = ['isDirty'];

    const a = this.accountsList as Authentication[];
    const b = this.accountsListDummy as IAuthentication[];

    if (!compareComplexObjects(a, b, listOfExcludedObject)) {
      return true;
    }
    return false;
  }

  sentPassword(value: ChangePassword) {

    this.userAdministrationService.SentPassword(value).subscribe(x => {
      if (x.success === true) {
        this.showInfo(MessageLibrary.REGISTER_SEND_PASSWORD, 'REGISTER_SEND_PASSWORD');
      } else { this.showInfo(MessageLibrary.REGISTER_SEND_PASSWORD_ERROR, 'REGISTER_SEND_PASSWORD_ERROR'); }
    });
  }

  /* #endregion  UserAdministration */

  

  /* #region   various */

  private countSettings(action: boolean) {
    if (action) {
      this.settingsCount++;
    } else {
      this.settingsCount--;
    }
    if (this.settingsCount === 0) {
      this.readSettingList();
      this.IfStorageIsSuccessful();
    }
  }

  readSettingList() {

    this.dataSettingsVariousService.readSettingList().subscribe((l:ISetting[]) => {
      if (l) {
        this.settingList = l;
        this.resetSetting();
        this.settingList.forEach(x => this.setSetting(x));

        this.isReset.emit();

      }
    });
  }

  readSettingList1() {
    return this.dataSettingsVariousService.readSettingList();
  }

  private resetSetting() {
    this.appName = '';
    this.appAddressName = '';
    this.appSupplementAddress = '';
    this.appAddressAddress = '';
    this.appAddressZip = '';
    this.appAddressPlace = '';
    this.appAddressPhone = '';
    this.appAddressMail = '';
    this.appAddressAccountingStart = 0;

    this.appNameDummy = '';
    this.appAddressNameDummy = '';
    this.appSupplementAddressDummy = '';
    this.appAddressAddressDummy = '';
    this.appAddressZipDummy = '';
    this.appAddressPlaceDummy = '';
    this.appAddressPhoneDummy = '';
    this.appAddressMailDummy = '';
    this.appAddressAccountingStartDummy = 0;


  }

  private setSetting(value: ISetting) {

    switch (value.type) {

      case AppSetting.APP_NAME:
        this.appName = value.value;
        this.appNameDummy = value.value;
        break;
      case AppSetting.APP_ADDRESS_NAME:
        this.appAddressName = value.value;
        this.appAddressNameDummy = value.value;
        break;
      case AppSetting.APP_ADDRESS_SUPPLEMENT:
        this.appSupplementAddress = value.value;
        this.appSupplementAddressDummy = value.value;
        break;
      case AppSetting.APP_ADDRESS_ADDRESS:
        this.appAddressAddress = value.value;
        this.appAddressAddressDummy = value.value;
        break;
      case AppSetting.APP_ADDRESS_ZIP:
        this.appAddressZip = value.value;
        this.appAddressZipDummy = value.value;
        break;
      case AppSetting.APP_ADDRESS_PLACE:
        this.appAddressPlace = value.value;
        this.appAddressPlaceDummy = value.value;
        break;
      case AppSetting.APP_ADDRESS_PHONE:
        this.appAddressPhone = value.value;
        this.appAddressPhoneDummy = value.value;
        break;
      case AppSetting.APP_ADDRESS_MAIL:
        this.appAddressMail = value.value;
        this.appAddressMailDummy = value.value;
        break;
      case AppSetting.APP_ACCOUNTING_START:
        this.appAddressAccountingStart = +value.value;
        this.appAddressAccountingStartDummy = +value.value;
        break;

      
    }
  }
  private saveSetting() {



    if (this.appName !== this.appNameDummy) {
      const c = this.settingList.find(x => x.type === AppSetting.APP_NAME);
      if (c) {
        this.countSettings(true);
        c.value = this.appName;
        this.dataSettingsVariousService.updateSetting(c).subscribe(() => { this.countSettings(false); });
      } else {
        const nc = new Setting();
        nc.value = this.appName;
        nc.type = AppSetting.APP_NAME;
        this.countSettings(true);
        this.dataSettingsVariousService.addSetting(nc).subscribe(() => { this.countSettings(false); });
      }

    }

    if (this.appAddressName !== this.appAddressNameDummy) {
      const c = this.settingList.find(x => x.type === AppSetting.APP_ADDRESS_NAME);
      if (c) {
        c.value = this.appAddressName;
        this.countSettings(true);
        this.dataSettingsVariousService.updateSetting(c).subscribe(() => { this.countSettings(false); });
      } else {
        const nc = new Setting();
        nc.value = this.appAddressName;
        nc.type = AppSetting.APP_ADDRESS_NAME;
        this.countSettings(true);
        this.dataSettingsVariousService.addSetting(nc).subscribe(() => { this.countSettings(false); });
      }
    }

    if (this.appSupplementAddress !== this.appSupplementAddressDummy) {
      const c = this.settingList.find(x => x.type === AppSetting.APP_ADDRESS_SUPPLEMENT);
      if (c) {
        c.value = this.appSupplementAddress;
        this.countSettings(true);
        this.dataSettingsVariousService.updateSetting(c).subscribe(() => { this.countSettings(false); });
      } else {
        const nc = new Setting();
        nc.value = this.appSupplementAddress;
        nc.type = AppSetting.APP_ADDRESS_SUPPLEMENT;
        this.countSettings(true);
        this.dataSettingsVariousService.addSetting(nc).subscribe(() => { this.countSettings(false); });
      }
    }

    if (this.appAddressAddress !== this.appAddressAddressDummy) {
      const c = this.settingList.find(x => x.type === AppSetting.APP_ADDRESS_ADDRESS);
      if (c) {
        c.value = this.appAddressAddress;
        this.countSettings(true);
        this.dataSettingsVariousService.updateSetting(c).subscribe(()=> { this.countSettings(false); });
      } else {
        const nc = new Setting();
        nc.value = this.appAddressAddress;
        nc.type = AppSetting.APP_ADDRESS_ADDRESS;
        this.countSettings(true);
        this.dataSettingsVariousService.addSetting(nc).subscribe(() => { this.countSettings(false); });
      }
    }

    if (this.appAddressZip !== this.appAddressZipDummy) {
      const c = this.settingList.find(x => x.type === AppSetting.APP_ADDRESS_ZIP);
      if (c) {
        c.value = this.appAddressZip;
        this.countSettings(true);
        this.dataSettingsVariousService.updateSetting(c).subscribe(() => { this.countSettings(false); });
      } else {
        const nc = new Setting();
        nc.value = this.appAddressZip;
        nc.type = AppSetting.APP_ADDRESS_ZIP;
        this.countSettings(true);
        this.dataSettingsVariousService.addSetting(nc).subscribe(()=> { this.countSettings(false); });
      }
    }

    if (this.appAddressPlace !== this.appAddressPlaceDummy) {
      const c = this.settingList.find(x => x.type === AppSetting.APP_ADDRESS_PLACE);
      if (c) {
        c.value = this.appAddressPlace;
        this.countSettings(true);
        this.dataSettingsVariousService.updateSetting(c).subscribe(() => { this.countSettings(false); });
      } else {
        const nc = new Setting();
        nc.value = this.appAddressPlace;
        nc.type = AppSetting.APP_ADDRESS_PLACE;
        this.countSettings(true);
        this.dataSettingsVariousService.addSetting(nc).subscribe(() => { this.countSettings(false); });
      }
    }

    if (this.appAddressPhone !== this.appAddressPhoneDummy) {
      const c = this.settingList.find(x => x.type === AppSetting.APP_ADDRESS_PHONE);
      if (c) {
        c.value = this.appAddressPhone;
        this.countSettings(true);
        this.dataSettingsVariousService.updateSetting(c).subscribe(()=> { this.countSettings(false); });
      } else {
        const nc = new Setting();
        nc.value = this.appAddressPhone;
        nc.type = AppSetting.APP_ADDRESS_PHONE;
        this.countSettings(true);
        this.dataSettingsVariousService.addSetting(nc).subscribe(()=> { this.countSettings(false); });
      }
    }

    if (this.appAddressMail !== this.appAddressMailDummy) {
      const c = this.settingList.find(x => x.type === AppSetting.APP_ADDRESS_MAIL);
      if (c) {
        c.value = this.appAddressMail;
        this.countSettings(true);
        this.dataSettingsVariousService.updateSetting(c).subscribe(() => { this.countSettings(false); });
      } else {
        const nc = new Setting();
        nc.value = this.appAddressMail;
        nc.type = AppSetting.APP_ADDRESS_MAIL;
        this.countSettings(true);
        this.dataSettingsVariousService.addSetting(nc).subscribe(() => { this.countSettings(false); });
      }
    }

    if (this.appAddressAccountingStart !== this.appAddressAccountingStartDummy) {
      const c = this.settingList.find(x => x.type === AppSetting.APP_ACCOUNTING_START);
      if (c) {
        c.value = this.appAddressAccountingStart.toString();
        this.countSettings(true);
        this.dataSettingsVariousService.updateSetting(c).subscribe(() => { this.countSettings(false); });
      } else {
        const nc = new Setting();
        nc.value = this.appAddressAccountingStart.toString();
        nc.type = AppSetting.APP_ACCOUNTING_START;
        this.countSettings(true);
        this.dataSettingsVariousService.addSetting(nc).subscribe(() => { this.countSettings(false); });
      }

    }

    

  }

  private isSetting_Dirty(): boolean {

    if (this.appName !== this.appNameDummy) { return true; }
    if (this.appAddressName !== this.appAddressNameDummy) { return true; }
    if (this.appSupplementAddress !== this.appSupplementAddressDummy) { return true; }
    if (this.appAddressAddress !== this.appAddressAddressDummy) { return true; }
    if (this.appAddressZip !== this.appAddressZipDummy) { return true; }
    if (this.appAddressPlace !== this.appAddressPlaceDummy) { return true; }
    if (this.appAddressPhone !== this.appAddressPhoneDummy) { return true; }
    if (this.appAddressMail !== this.appAddressMailDummy) { return true; }
    if (this.appAddressAccountingStart !== this.appAddressAccountingStartDummy) { return true; }
    

    return false;
  }

  /* #endregion   various */

  /* #region   countries */

  readCountryList() {
    this.dataCountryStateService.getCountryList().subscribe(
      (x) => {
        if (x) {
          this.countriesList = x as ICountry[];
          this.countriesListDummy = cloneObject(this.countriesList);
          this.isReset.emit();
        }
      });
  }

  private countActionCountry(action: boolean) {
    if (action) {
      this.countriesListCount++;
    } else {
      this.countriesListCount--;
    }
    if (this.countriesListCount === 0) {
      this.readCountryList();
      this.IfStorageIsSuccessful();
    }
  }

  private saveCountryList() {


    this.countriesList.forEach(async (x) => {
      if (x.name && x.name === '' && x.isDirty && x.isDirty === CreateEntriesEnum.rewrite) {
        this.countActionCountry(true);
        this.dataCountryStateService
          .deleteCountry(x.id!)
          .subscribe((X) => {
            this.countActionCountry(false);
          });
      } else if (x.isDirty === 3) {
        this.countActionCountry(true);
        this.dataCountryStateService
          .deleteCountry(x.id!)
          .subscribe((X) => {
            this.countActionCountry(false);
          });
      } else if (x.name && x.name !== '' && x.isDirty && x.isDirty === CreateEntriesEnum.new) {
       
        this.countActionCountry(true);
        this.dataCountryStateService
          .addCountry(x)
          .subscribe((X) => {
            this.countActionCountry(false);
          });
      } else if (x.name && x.name !== '' && x.isDirty && x.isDirty === CreateEntriesEnum.rewrite) {
        this.countActionCountry(true);
        this.dataCountryStateService
          .updateCountry(x)
          .subscribe((X) => {
            this.countActionCountry(false);

          });
      }
    });
  }

  private isCountryList_Dirty(): boolean {
    const listOfExcludedObject = ['isDirty'];

    const a = this.countriesList as ICountry[];
    const b = this.countriesListDummy as ICountry[];

    if (!compareComplexObjects(a, b, listOfExcludedObject)) {

      // Bei unfertigen Eingaben wird kein isDirty geworfen
      const tmp = this.countriesList.filter(x =>
        x.isDirty === CreateEntriesEnum.new && (x.name === '' || x.abbreviation === '' || x.prefix === '')
      );

      if (tmp && tmp.length !== 0) { return false; }
      return true;
    }
    return false;
  }

  areObjectsDirty(): boolean {



    if (this.isSetting_Dirty()) {
      return true;
    }
    if (this.isCountryList_Dirty()) {
      return true;
    }
    if (this.isAccountsList_Dirty()) {
      return true;
    }
    
    return false;
  }

  save() {
    
    if (this.isSetting_Dirty()) {
      this.saveSetting();
    }
    if (this.isCountryList_Dirty()) {
      this.saveCountryList();
    }
    if (this.isAccountsList_Dirty()) {
      this.saveAccountsRole();
    }
   
  }

  IfStorageIsSuccessful() {
         this.isDirty = this.areObjectsDirty();
  
  }


  showError(Message: string, errorName = '') {
    if (errorName) {
      const y = this.toastService.toasts.find(x => x.name === errorName);
      this.toastService.remove(y);
    }

    this.toastService.show(Message, {
      classname: 'bg-danger text-light',
      delay: 3000,
      name: errorName,
      autohide: true,
      headertext: 'Fehler'
    });
  }

  showInfo(Message: string, infoName = '') {
    if (infoName) {
      const y = this.toastService.toasts.find(x => x.name === infoName);
      this.toastService.remove(y);
    }
    this.toastService.show(Message, {
      classname: 'bg-info text-light',
      delay: 5000,
      name: infoName,
      autohide: true,
      headertext: 'Info'
    });
  }

 
  readData() {

   
    this.readAccountsList();
       this.readSettingList();
      this.readCountryList();
  
  }

  resetData() {
    this.readData();
  }
}
