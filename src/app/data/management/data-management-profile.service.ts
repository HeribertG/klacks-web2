import { Injectable, Inject, EventEmitter, Output } from '@angular/core';
import { compareComplexObjects, cloneObject } from '../../helpers/object-helpers';
import { ChangePassword } from '../../core/authentification-class';
import { ToastService } from '../../toast/toast.service';
import { MessageLibrary } from '../../helpers/string-constants';
import { UserAdministrationService } from '../user-administration.service';
import {
  ICommunicationType,
  ICommunication,
  ICommunicationPrefix,
  CommunicationPrefix,
  ICountry,
  Communication,
  IEmployee
} from 'src/app/core/employee-class';
import { DataEmployeeService } from '../data-employee.service';
import { DataCountryStateService } from '../data-country-state.service';


@Injectable({
  providedIn: 'root'
})
export class DataManagementProfileService {
  @Output() isReset = new EventEmitter();


  changePasswordWrapper: ChangePassword | undefined;
  changePasswordWrapperDummy: ChangePassword| undefined;
  isPasswordDirty = false;

  editEmployee: IEmployee| undefined;
  editClientDummy: IEmployee| undefined;
  stateList: string[]=[];
  communicationTypePhoneList: ICommunicationType[]=[];
  communicationTypeEmailList: ICommunicationType[]=[];
  communicationPrefixList: ICommunicationPrefix[]=[];
  communicationPhoneList: ICommunication[]=[];
  communicationEmailList: ICommunication[]=[];
  countries: ICountry[]=[];

  private isInit = false;

  constructor(
    @Inject(DataEmployeeService)
    public dataEmployeeService: DataEmployeeService,
    @Inject(UserAdministrationService)
    public userAdministrationService: UserAdministrationService,
    private dataCountryStateService: DataCountryStateService,
    public toastService: ToastService
  ) { }


  init() {

    if (this.isInit === false) {

      this.stateList = this.dataCountryStateService.getState();
      this.dataCountryStateService.getCountryList().subscribe(
        (x) => {
          if (x) {
            this.countries = x as ICountry[];

            this.communicationPrefixList = [];
            this.countries.forEach(y => {

              const c = new CommunicationPrefix();
              c.id = y.id!;
              c.name = y.name!;
              c.prefix = y.prefix!;
              this.communicationPrefixList.push(c);
            });

            this.communicationPrefixList.unshift(new CommunicationPrefix());
          }
        });

      this.dataEmployeeService.readCommunicationTypeList().subscribe(
        (x) => {
          if (x) {
            this.communicationTypePhoneList = x.filter(y => y.category === 0);
            this.communicationTypeEmailList = x.filter(y => y.category === 1);
          }
        });


      this.isInit = true;
    }

  }

  /* #region  User as EditClient */

  readEditClient(key: string) {
    if (key && key !== '') {
      this.dataEmployeeService.getEmployee(key)
        .subscribe(x => {
          if (x) { this.prepareClient(x); }
        });
    }
  }

  prepareClient(value: IEmployee) {
    this.editEmployee = value;
    this.setCommunication();

    this.editClientDummy = cloneObject(this.editEmployee);
    this.isReset.emit();
  }

  saveEditClient() {
    this.dataEmployeeService.updateEmployee(this.editEmployee!)
      .subscribe(x => {
        this.prepareClient(x);
        this.areObjectsDirty();
      }
      );
  }

  private setCommunication() {
    let count = 0;
    this.editEmployee!.communications.forEach((x) => {
      this.isPhone(x);
      this.isEmail(x);
      x.index = count;
      count++;
    });

    this.communicationPhoneList = this.editEmployee!.communications.filter(x => x.isPhone === true);
    this.communicationEmailList = this.editEmployee!.communications.filter(x => x.isEmail === true);


    if (this.communicationPhoneList.length === 0) {
      const c = new Communication();
      c.isPhone = true;
      this.communicationPhoneList.push(c);
    }
    if (this.communicationEmailList.length === 0) {
      const c = new Communication();
      c.isEmail = true;
      this.communicationEmailList.push(c);
    }
  }

  private isEditClient_Dirty(): boolean {
    const listOfExcludedObject = ['isDirty'];

    const a = this.editEmployee as IEmployee;
    const b = this.editClientDummy as IEmployee;

    if (!compareComplexObjects(a, b)) {
      return true;
    }
    return false;
  }

  private isPhone(data: ICommunication) {

    if (this.communicationTypePhoneList) {
      const p = this.communicationTypePhoneList.find(x => +x.type === data.type);
      if (p) {

        if ((p.category === 0) === true) {
          data.isPhone = true;

        }

      }

    }

  }

  private isEmail(data: ICommunication) {

    if (this.communicationTypeEmailList) {

      const p = this.communicationTypeEmailList.find(x => +x.type === data.type);
      if (p) {

        if ((p.category === 1) === true) {
          data.isEmail = true;

        }

      }
    }
  }

  addPhone() {

    const c = new Communication();
    if (this.communicationTypePhoneList && this.communicationTypePhoneList.length > 0) {
      c.type = this.communicationTypePhoneList[0].type;
    }

    this.editEmployee!.communications.push(c);

    this.setCommunication();

  }

  delPhone(index: number) {

    this.editEmployee!.communications.splice(index, 1);

    this.setCommunication();
  }

  addEmail() {

    const c = new Communication();
    if (this.communicationTypeEmailList &&
      this.communicationTypeEmailList.length > 0) { c.type = this.communicationTypeEmailList[0].type; }

    this.editEmployee!.communications.push(c);

    this.setCommunication();

  }

  delEmail(index: number) {

    this.editEmployee!.communications.splice(index, 1);

    this.setCommunication();
  }

  /* #endregion  User as EditClient */

  /* #region  ChangePassword */


  passwordChangeIsAllowed(value: boolean) {
    this.isPasswordDirty = value;
  }

  private isChangePassword_Dirty(): boolean {
    return this.isPasswordDirty;
  }
  private changePassword() {
    this.userAdministrationService.changePassword(this.changePasswordWrapper!)
      .subscribe(() => {
        this.isPasswordDirty = false;
        this.showSuccess(MessageLibrary.REGISTER_CHANGE_PASSWORD, MessageLibrary.REGISTER_CHANGE_PASSWORD_HEADER);
      });
  }

  /* #endregion  ChangePassword */


  areObjectsDirty(): boolean {


    if (this.isChangePassword_Dirty()) {
      return true;
    }

    if (this.isEditClient_Dirty()) {
      return true;
    }

    return false;
  }

  save() {
    if (this.isChangePassword_Dirty()) {
      this.changePassword();
      this.changePasswordWrapper!.oldPassword = '';
      this.changePasswordWrapper!.password = '';
      this.isReset.emit();
    }

    if (this.isEditClient_Dirty()) {
      this.saveEditClient();
    }
  }

  readOptions() {
  }

  readData() {

    this.changePasswordWrapper = new ChangePassword();
    const username = localStorage.getItem(MessageLibrary.TOKEN_USERNAME);
    const subject = localStorage.getItem(MessageLibrary.TOKEN_SUBJECT);


    if (username && subject) {
      this.changePasswordWrapper.userName = username;
      this.changePasswordWrapper.email = subject;
    }

    this.changePasswordWrapperDummy = cloneObject(this.changePasswordWrapper);

  }


  showSuccess(message: string, header: string) {
    this.toastService.show(message, {
      classname: 'bg-success text-light',
      delay: 2000,
      autohide: true,
      headertext: header
    });
  }
}
