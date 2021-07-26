import { EventEmitter, Injectable, Output } from '@angular/core';
import { DataEmployeeService } from '../data-employee.service';
import {
  ITruncatedEmployee,
  FilterEmployee,
  IEmployee,
  CheckBoxValue,
  ICountry,
  ICommunicationType,
  ICommunicationPrefix,
  ICommunication,
  Communication,
  CommunicationPrefix,
  Address,
  Annotation,
  IAddress,
  Employee,
  Staff,
  IHistory,
  FilterHistory,
  IPostCodeCH,
} from '../../core/employee-class';
import { compareComplexObjects, cloneObject, createStringId } from '../../helpers/object-helpers';
import { DataCountryStateService } from '../data-country-state.service';
import {
  DateToString,
  formatPhoneNumber,
  transformDateToNgbDateStruct,

} from 'src/app/helpers/format-helper';
import { ToastService } from 'src/app/toast/toast.service';
import {AddressTypeEnum, CommunicationTypeDefaultIndexEnum, GenderEnum, InitFinished} from 'src/app/helpers/enums/client-enum';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class DataManagementEmployeeService {
  @Output() isReset = new EventEmitter();
  @Output() isRead = new EventEmitter();
  @Output() isReadChangeList = new EventEmitter();
  @Output() isF5ReRead = new EventEmitter();
  @Output() iniIsRead = new EventEmitter();

  currentFilter: FilterEmployee = new FilterEmployee();
  currentFilterDummy= new FilterEmployee();
  temporaryFilterDummy= new FilterEmployee();
  LastChangeFilter: FilterEmployee = new FilterEmployee();
  listWrapper: ITruncatedEmployee|null =null;
  lastChangeListWrapper: ITruncatedEmployee|null =null;
  editEmployee: IEmployee|null =null;
  editEmployeeDummy: IEmployee|null =null;
  checkedArray: CheckBoxValue[] = new Array<CheckBoxValue>();
  // tslint:disable-next-line: no-inferrable-types
  headerCheckBoxValue: boolean = false;
  maxItems = 0;
  firstItem = 0;

  lastChangeMaxItems = 0;
  subTitleLastChanges = '';
  subTitleLastChangesAllAddress = '';

  countries = new Array<ICountry>();
  communicationTypePhoneList = new Array<ICommunicationType>();
  communicationTypeEmailList = new Array<ICommunicationType>();
  communicationPrefixList = new Array<ICommunicationPrefix>();
  communicationPhoneList = new Array<ICommunication>();
  communicationEmailList = new Array<ICommunication>();


  isSwissAbbreviation = 'CH';
  isSwissPrefixId = '';
  defaultTypePhone = -1;
  defaultTypeEmail = -1;

  currentDiplomIndex = -1;
  currentAddressIndex = -1;
  currentAnnotationIndex = -1;
  maxAddressType = 3;

  private isInit = false;
  initCount = 0;
  showProgressSpinner = false;



  editEmployeeLastMutation = '';
  editEmployeeDeleted = false;


  currentHistoryList: IHistory[]=[];
  filterHistory = new FilterHistory();
  lastContries: IPostCodeCH[]=[];

  employeeAdressListWithoutQueryFilter:IAddress[]=[];

  // Ist für die Ansicht der gefundenen Mitglieder beim
  // Neuanlegen einer Adresse
  findEmployee: IEmployee[] = [];
  sortedFindEmployee: IEmployee[] = [];
  findEmployeeCount = 0;
  findEmployeePage = 0;
  findEmployeeMaxVisiblePage = 5;
  findEmployeeMaxPages = 1;
  backupFindEmployee: IEmployee|null =null;
  backupFindEmployeeDummy: IEmployee|null =null;
  backupFindEmployeeList = [];

  constructor(
    public dataEmployeeService: DataEmployeeService,
    public toastService: ToastService,
    private dataCountryStateService: DataCountryStateService,
    private router: Router,
  ) { }

  /* #region   init */

  init() {

    if (this.isInit === false) {

      this.initCount = 0;
      this.countries = [];
      this.currentFilter.countries = [];
      this.currentFilter.countriesHaveBeenReadIn = false;

      // tslint:disable-next-line: deprecation
      this.dataCountryStateService.getCountryList().subscribe(
        (x: ICountry[]) => {
          if (x) {

            this.countries = x as ICountry[];
            this.currentFilter.countries = x as ICountry[];

            this.currentFilter.countriesHaveBeenReadIn = (x.length > 0);


            this.communicationPrefixList = [];
            this.currentFilter.countries.forEach(y => {

              const c = new CommunicationPrefix();
              c.id = y.id!;
              c.name = y.name!;
              c.prefix = y.prefix!;
              this.communicationPrefixList.push(c);

              if (y.abbreviation === this.isSwissAbbreviation) { this.isSwissPrefixId = y.prefix!; }
            });


            this.communicationPrefixList.unshift(new CommunicationPrefix());
            this.isInitFinished(1);

          }
        });

      // tslint:disable-next-line: deprecation
      this.dataEmployeeService.readCommunicationTypeList().subscribe(
        (x) => {
          if (x) {
            this.communicationTypePhoneList = x.filter(y => y.category === 0);
            this.communicationTypeEmailList = x.filter(y => y.category === 1);

            const tmp = x.find(y => y.defaultIndex === CommunicationTypeDefaultIndexEnum.phone);
            if (tmp) { this.defaultTypePhone = tmp.type; }

            const tmp1 = x.find(y => y.defaultIndex === CommunicationTypeDefaultIndexEnum.email);
            if (tmp1) { this.defaultTypeEmail = tmp1.type; }

            this.isInitFinished(1);

          }
        });

      
      
      this.isInit = true;
    }


  }

 
  private isInitFinished(hit: number): void {
    this.initCount += hit;
    if (this.initCount === InitFinished.Finished) {

      this.iniIsRead.emit(true);
    }

  }

  /* #endregion   init */

  /* #region   temporary check is Filter dirty */

  public setTemporaryFilter() {
    this.temporaryFilterDummy = cloneObject(this.currentFilter);
  }

  public isTemoraryFilter_Dirty(): boolean {

    const a = this.currentFilter as FilterEmployee;
    const b = this.temporaryFilterDummy as FilterEmployee;

    if (!compareComplexObjects(a, b)) {
      return true;
    }
    return false;
  }

  /* #endregion   temporary check is Filter dirty */

  /* #region   list client */

  readPage(isSecondRead: boolean = false) {

    // Hack, vieleicht hilfst es
    if (!this.currentFilter.countries) {
      this.isInit = false;
      this.init();
    }


    this.dataEmployeeService
      // tslint:disable-next-line: deprecation
      .readEmployeeList(this.currentFilter).subscribe(x => {

        this.listWrapper = x;

        if (this.isFilter_Dirty()) {
          this.currentFilterDummy = cloneObject(this.currentFilter);
          this.maxItems = x.maxItems;
          this.firstItem = x.firstItemOnPage;
        }

        this.showProgressSpinner = false;

      });

    if (!isSecondRead) {
      this.isRead.emit();
    }
  }

  deleteEmployee(key: string) {
    return this.dataEmployeeService.deleteEmployee(key);

  }


  private isFilter_Dirty(): boolean {

    const a = this.currentFilter as FilterEmployee;
    const b = this.currentFilterDummy as FilterEmployee;

    if (!compareComplexObjects(a, b)) {

      return true;
    }
    return false;
  }


 

  /* #endregion   list client */

  /* #region   last Change client */

  readChangeList(isSecondRead: boolean = false) {

    this.dataEmployeeService
      // tslint:disable-next-line: deprecation
      .readChangeList(this.LastChangeFilter).subscribe(x => {

                this.lastChangeListWrapper = x;

        this.subTitleLastChanges = `${DateToString(x.lastChange!)}, bearbeitet von ${x.editor}`;
        this.lastChangeMaxItems = x.maxItems;

        if (!isSecondRead) {
          this.isReadChangeList.emit();
        }
      });
  }

  clearCheckedArray() {
    this.checkedArray = new Array<CheckBoxValue>();

  }

  addCheckBoxValueToArray(value: CheckBoxValue) {
    this.checkedArray.push(value);
  }

  findCheckBoxValue(key: string): CheckBoxValue|null {
    if (!this.checkedArray) { return null; }
    if (key === '') { return null; }

    return this.checkedArray.find(x => x.id === key) as CheckBoxValue;
  }

  removeCheckBoxValueToArray(key: string) {
    const index = this.checkedArray.findIndex(x => x.id === key);
    this.checkedArray.splice(index, 1);
  }

  checkBoxIndeterminate() {

    if (this.headerCheckBoxValue === undefined) { this.headerCheckBoxValue = false; }
    if (this.headerCheckBoxValue === null) { this.headerCheckBoxValue = false; }

    if (this.headerCheckBoxValue === true) {
      const tmp = this.checkedArray.find(x => x.Checked === false);
      if (!(tmp === undefined || tmp === null)) { return true; }
    }
    if (this.headerCheckBoxValue === false) {
      const tmp = this.checkedArray.find(x => x.Checked === true);
      if (!(tmp === undefined || tmp === null)) { return true; }
    }



    return false;
  }

  
  /* #endregion   last Change client */

  /* #region   edit client */

  showExternalEmployee(id: string) {

    // tslint:disable-next-line: deprecation
    this.dataEmployeeService.getEmployee(id).subscribe(x => {
      const client = x;

      this.prepareEmployee(x);

      this.router.navigate(['/workplace/edit-address']);


    });
  }

  prepareEmployee(value: IEmployee, withoutUpdateDummy = false) {
    if (value == null) { return; }


    // Hack, if a F5 update was executed and not everything is fully initialized
    if (!this.isInit) {
      this.init();
    }



    this.editEmployee = value;

    this.currentDiplomIndex = -1;
    this.currentAnnotationIndex = -1;
    this.employeeAdressListWithoutQueryFilter = [];
    this.editEmployeeLastMutation = '';

    this.setDateStruc();
    this.setAdress();
    this.setCommunication();
   
  

    this.editEmployeeDeleted = this.editEmployee.isDeleted;

    if (!withoutUpdateDummy) { this.editEmployeeDummy = cloneObject(this.editEmployee); }


    if (this.editEmployee.id) {

      setTimeout(() => history.pushState(null, '', this.createUrl()), 100);
    }

    this.isReset.emit();

  }

  createUrl(): string {
    return 'workplace/edit-address?id=' + this.editEmployee!.id;
  }

  readEmployee(id: string) {
    if (id !== '') {
      // tslint:disable-next-line: deprecation
      this.dataEmployeeService.getEmployee(id).subscribe(x => {
        // dirty hack
        this.isF5ReRead.emit();
        this.prepareEmployee(x);

      });
    }
  }

  isCurrentAddressMainAdress(): boolean {
    return this.editEmployee!.addresses[this.currentAddressIndex].type === 0;
  }


  createEmployee() {

    // tslint:disable-next-line: deprecation
     

      const c = new Employee();
      c.staff   = new Staff();
      c.staff.validFrom = new Date();
      const a = c.addresses[0];
      a.validFrom = new Date();
      a.type = AddressTypeEnum.customer;
     

      this.prepareEmployee(c);
      this.resetFindlistbackup();

      this.router.navigate(['/workplace/edit-address']);
    

  }

  

  removeCurrentAddress() {
    this.editEmployee!.addresses[this.currentAddressIndex].isDeleted = true;
    this.setAdress();
  }

  saveEditEmployee(withoutUpdateDummy = false) {

   
    if (this.editEmployee!.id === null || this.editEmployee!.id === '') {
      this.dataEmployeeService.addEmployee(this.editEmployee!)
        // tslint:disable-next-line: deprecation
        .subscribe(x => {
          this.prepareEmployee(x, withoutUpdateDummy);

        }
        );
    } else {
      this.dataEmployeeService.updateEmployee(this.editEmployee!)
        // tslint:disable-next-line: deprecation
        .subscribe(x => {
          this.prepareEmployee(x);
        }
        );
    }
  }

  
  addAnnotation() {
    this.editEmployee!.annotations.push(new Annotation());
  }

  removeCurrentAnnotation() {
    this.editEmployee!.annotations[this.currentAnnotationIndex].isDeleted = true;
    this.editEmployee!.annotations[this.currentAnnotationIndex]
      .note = this.editEmployee!.annotations[this.currentAnnotationIndex]
        .note + '--isDeleted';
  }

  readEmployeeAdressListWithoutQueryFilter() {

    if (!this.employeeAdressListWithoutQueryFilter) {
      // tslint:disable-next-line: deprecation
      this.dataEmployeeService.readEmployeeaddressList(this.editEmployee!.id!).subscribe(x => {
        this.employeeAdressListWithoutQueryFilter = x;
      });
    }
  }

  addPhone() {

    const c = new Communication();
    if (this.defaultTypePhone !== -1) {
      c.type = this.defaultTypePhone;
    } else {
      if (this.communicationTypePhoneList.length > 0) {
        c.type = this.communicationTypePhoneList[0].type;
      }
    }

    c.prefix = this.isSwissPrefixId;
    c.isPhone = true;

    this.editEmployee!.communications.push(c);

    this.setCommunication();

  }

  delPhone(index: number) {

    this.editEmployee!.communications[index].isDeleted = true;

    this.setCommunication();
  }

  addEmail() {

    const c = new Communication();

    if (this.defaultTypeEmail !== -1) {
      c.type = this.defaultTypeEmail;
    } else {
      if (this.communicationTypeEmailList &&
        this.communicationTypeEmailList.length > 0) { c.type = this.communicationTypeEmailList[0].type; }
    }
    c.isEmail = true;

    this.editEmployee!.communications.push(c);

    this.setCommunication();

  }

  delEmail(index: number) {

    this.editEmployee!.communications[index].isDeleted = true;

    this.setCommunication();
  }

  private setDateStruc() {

    this.editEmployee!.internalBirthdate = transformDateToNgbDateStruct(this.editEmployee!.birthdate!);
    this.editEmployee!.staff!.internalValidFrom = transformDateToNgbDateStruct(this.editEmployee!.staff!.validFrom!);
    this.editEmployee!.staff!.internalValidUntil = transformDateToNgbDateStruct(this.editEmployee!.staff!.validUntil!);

  }

  
  private setCurrentAddressIndex(): number {

    if (this.currentAddressIndex === -1) {


      // If it has more than one address, select which one is visible
      if (this.editEmployee!.addresses.length > 1) {

        // first sort by date

        this.editEmployee!.addresses.sort((a: IAddress, b: IAddress) => {
          const first = a.validFrom as Date;
          const second = b.validFrom as Date;

          return first > second ? -1 : first < second ? 1 : 0;


        });

        // second search the current Address

        const current = new Date();
        const collectScopeAddresses = new Array<IAddress>();
        const collectfutureAddresses = new Array<IAddress>();
        let currentIndex = this.editEmployee!.addresses.length - 1;

        this.editEmployee!.addresses.forEach(itm => {
          itm.isScoped = false;
          itm.isFuture = false;
          const tmpDate = new Date(itm.validFrom!);

          // all current and past addresses
          // all future addresses are filtered out here
          if (tmpDate <= current) {
            if (itm.isDeleted === false) {

              collectScopeAddresses.push(itm);
              itm.isScoped = true;
              this.editEmployee!.hasScopeAddress = true;
            }
          } else {
            if (itm.isDeleted === false) {

              collectfutureAddresses.push(itm);
              itm.isFuture = true;
              this.editEmployee!.hasFutureAddress = true;
            }
          }
        });

        collectScopeAddresses.sort((a: IAddress, b: IAddress) => {
          const first = a.type as number;
          const second = b.type as number;

          return first < second ? -1 : first > second ? 0 : 1;
        });


        // all past addresses are sorted out
        for (let i = 0; i < this.maxAddressType; i++) {
          const findTypeArray = collectScopeAddresses.filter(x => x.type === i);
          if (findTypeArray && findTypeArray.length > 0) {
            for (let ii = 1; ii < findTypeArray.length; ii++) {
              findTypeArray[ii].isScoped = false;
              this.editEmployee!.hasPastAddress = true;
            }
          }
        }

        this.editEmployee!.addresses.sort((a: IAddress, b: IAddress) => {
          const first = a.type as number;
          const second = b.type as number;
          return first < second ? -1 : first > second ? 0 : 1;
        });

        currentIndex = this.editEmployee!.addresses.findIndex(x => x.id === collectScopeAddresses[0].id);

        return currentIndex;

      } else {
        this.editEmployee!.addresses[0].isScoped = true;
        this.editEmployee!.hasScopeAddress = true;
        return 0;
      }
    }

    return this.currentAddressIndex;
  }

 

  reReadAddress() {
    this.setAdress();
  }

  private setAdress() {
    let isError = false;
    this.currentAddressIndex = -1;
    try {
      this.currentAddressIndex = this.setCurrentAddressIndex();
    } catch (e) {
      isError = true;
      this.currentAddressIndex = 0;
    }

    if (this.editEmployee!.addresses.length === 0) {
      const c = new Address();
      c.validFrom = new Date();
      c.isScoped = true;

      this.editEmployee!.addresses.push(c);
    }
  }

  private setCommunication() {
    let count = 0;
    this.editEmployee!.communications.forEach(x => {
      x.internalId = createStringId();

      this.isPhone(x);
      this.isEmail(x);
      x.index = count;
      count++;
    });

    this.communicationPhoneList = this.editEmployee!.communications.filter(x => x.isPhone === true );
    this.communicationEmailList = this.editEmployee!.communications.filter(x => x.isEmail === true);


    if (this.communicationPhoneList.length === 0) {

      const c = new Communication();
      if (this.defaultTypePhone !== -1) {
        c.type = this.defaultTypePhone;
      } else {
        if (this.communicationTypePhoneList && this.communicationTypePhoneList.length > 0) {
          c.type = this.communicationTypePhoneList[0].type;
        }
      }


      c.prefix = this.isSwissPrefixId;

      c.isPhone = true;
      this.communicationPhoneList.push(c);
    }
    if (this.communicationEmailList.length === 0) {
      const c = new Communication();

      if (this.defaultTypeEmail !== -1) {
        c.type = this.defaultTypeEmail;
      } else {
        if (this.communicationTypeEmailList &&
          this.communicationTypeEmailList.length > 0) { c.type = this.communicationTypeEmailList[0].type; }
      }
      c.isEmail = true;

      this.communicationEmailList.push(c);
    }
  }

  private isPhone(data: ICommunication) {

    if (this.communicationTypePhoneList) {
      const p = this.communicationTypePhoneList.find(x => +x.type === data.type);
      if (p) {

        if ((p.category === 0) === true) {
          data.isPhone = true;
          data.value = formatPhoneNumber(data.value);
        }
      }
    }
  }

  public isEmail(data: ICommunication) {
    if (this.communicationTypeEmailList) {
      const p = this.communicationTypeEmailList.find(x => +x.type === data.type);
      if (p) {

        if ((p.category === 1) === true) {
          data.isEmail = true;

        }
      }
    }
  }

  

  private isEditEmployee_Dirty(): boolean {

    const a = this.editEmployee as IEmployee;
    const b = this.editEmployeeDummy as IEmployee;

    if (!compareComplexObjects(a, b)) {
      return true;
    }
    return false;
  }

 
  readHistory() {
    this.filterHistory!.key = this.editEmployee!.id!;
    // tslint:disable-next-line: deprecation
    this.dataEmployeeService.readHistoryList(this.filterHistory).subscribe(x => {
      this.currentHistoryList = x.histories;
      this.filterHistory.maxItems = x.maxItems;

    });
  }

 

  /* #endregion   edit client */

  
  /* #region   create Infos */

  createHTMLAddress(client: Employee, currentAddress: Address): string {
    let address = '';

    if (currentAddress) {

      if (currentAddress.type === AddressTypeEnum.customer) {
        if (client.company) { address += client.company; address += '<br>'; }
        if (client.title) { address += client.title; address += '<br>'; }

        address += client.firstName; address += ' ';
        if (client.secondName) { address += client.secondName.substring(0, 1); address += '. '; }
        address += client.name; address += '<br>';
        if (currentAddress.street) { address += currentAddress.street; address += '<br>'; }
        if (currentAddress.street2) { address += currentAddress.street2; address += '<br>'; }
        if (currentAddress.street3) { address += currentAddress.street3; address += '<br>'; }
        address += currentAddress.zip; address += ' '; address += currentAddress.city; address += '<br>';

      } else {
        if (currentAddress.addressLine1) { address += currentAddress.addressLine1; address += '<br>'; }
        if (currentAddress.addressLine2) { address += currentAddress.addressLine2; address += '<br>'; }
        if (currentAddress.street) { address += currentAddress.street; address += '<br>'; }
        if (currentAddress.street2) { address += currentAddress.street2; address += '<br>'; }
        if (currentAddress.street3) { address += currentAddress.street3; address += '<br>'; }
        address += currentAddress.zip; address += ' '; address += currentAddress.city; address += '<br>';

      }
    } else {
      address = 'keine Adresse';
    }

    return address;
  }

  readGender(client: Employee): string {
    switch (+client.gender as GenderEnum) {
      case GenderEnum.female:
        return 'Frau';

      case GenderEnum.male:
        return 'Herr';

    }
    return '';
  }


  readSalutation(client: Employee): string {
    switch (+client.gender as GenderEnum) {
      case GenderEnum.female:
        return 'Sehr geehrte Frau ';

      case GenderEnum.male:
        return 'Sehr geehrter Herr ';

    }
    return 'Werte Damen und Herren ';
  }

  getHtmlWrapString(str: string): string {
    str = str.replace('\r\n', '\n');
    str = str.replace('\r', '\n');
    const spl = str.split('\n');

    let res = '';
    if (spl.length > 1) {

      for (let i = 0; i < spl.length; i++) {
        const item = spl[i];

        if (i < spl.length - 1) {
          res += item + '<br>';
        } else {
          res += item;
        }
      }
    } else {
      res = str;
    }

    return res;
  }

  francAmounts(value: number): string {
    return Math.floor(value).toString();
  }
  centAmounts(value: number): string {
    const s1 = Math.floor(value);
    const res = (((value * 100) - (s1 * 100)) / 100).toString();
    let result = res.substring(2, 4);

    if (result.length === 0) { result += '00'; }
    if (result.length === 1) { result += '0'; }

    return result;
  }

  /* #endregion   create Infos */


  /* #region   find Employees */

  findEmployees() {

    if (!this.editEmployee!.id) {

    
      let name = this.editEmployee!.name ?? '';
      let firstName = this.editEmployee!.firstName ?? '';

      if ( name || firstName) {

        name += ' ';
        firstName += ' ';

        // tslint:disable-next-line: deprecation
        this.dataEmployeeService.findEmployee( name, firstName).subscribe(x => {
          this.doSortfindEmployee(x);

        });
      } else {
        this.resetFindlist();
        this.resetFindlistbackup();
      }
    }
  }

  private resetFindlistbackup() {

    this.backupFindEmployee = null;
    this.backupFindEmployeeDummy = null;
    this.backupFindEmployeeList = [];
  }

  private resetFindlist() {
    this.findEmployee = [];
    this.findEmployeeCount = 0;
    this.sortedFindEmployee = [];
    this.findEmployeePage = 0;
  }


  doSortfindEmployee(lst: IEmployee[]) {

    this.findEmployeeCount = lst.length;
    this.findEmployeeMaxPages = Math.ceil(this.findEmployeeCount / this.findEmployeeMaxVisiblePage);
    this.findEmployee = lst;

    if (this.findEmployeeCount <= this.findEmployeeMaxVisiblePage) {
      this.sortedFindEmployee = lst;
      this.findEmployeePage = 0;
    } else {
      this.sortedFindEmployee = lst;
      this.findEmployeePage = 1;
      this.readActualSortedEmployeePage();
    }
  }

  readActualSortedEmployeePage() {

    const currPage = this.findEmployeePage - 1 < 0 ? 0 : this.findEmployeePage - 1;
    const startItem = currPage * this.findEmployeeMaxVisiblePage;
    const endItem = startItem + this.findEmployeeMaxVisiblePage;
    this.sortedFindEmployee = this.findEmployee.slice(startItem, endItem);

  }

  replaceEmployee(id: string) {
    this.backupFindEmployee = cloneObject(this.editEmployee);
    this.backupFindEmployeeDummy = cloneObject(this.editEmployeeDummy);
    this.backupFindEmployeeList = cloneObject(this.findEmployee);
    this.readEmployee(id);

  }

  resetFindEmployee() {


    this.editEmployee = cloneObject(this.backupFindEmployee);
    this.editEmployeeDummy = cloneObject(this.backupFindEmployeeDummy);
    this.findEmployee = cloneObject(this.backupFindEmployeeList);

    this.resetFindlistbackup();
    this.prepareEmployee(this.editEmployee!, true);

  }

  /* #endregion   find Employees */

  areObjectsDirty(): boolean {

    if (this.isEditEmployee_Dirty()) {
      return true;
    }
    return false;
  }

  save() {
    if (this.isEditEmployee_Dirty()) {
      this.saveEditEmployee();

    }
  }

  resetData() {
    this.prepareEmployee(this.editEmployeeDummy!);
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



}


