import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { BaseEntity, BaseFilter, BaseTruncated, IBaseEntity, IBaseFilter, IBaseTruncated } from './general-class';



export interface IDocumentHistory extends BaseEntity {
  id: string | null;
  path: string | null;
  groupKey: string | null;
  type: number;
  additionalData: string | null;
  isDeleted: boolean;
  professionId: string | null;
  originalName: string | null;

}

export interface IFilterCertificate {
  id: string | null;
  name: string | null;
  abbreviation: string | null;
  select: boolean | null;
}

export interface IFilterSection {
  abbreviation: string | null;
  section: string | null;
  select: boolean | null;
}

export interface IFilterStatus {
  status: string | null;
  type: number;
  select: boolean | null;
  isEmptyStatus: boolean | null;
}

export interface IPostCodeCH {


  id: | number | null;

  name: | number | null;

  zip: string | null;

  city: string | null;

  state: string | null;

}

export interface ICountry {
  id: string | null;
  abbreviation: string | null;
  name: string | null;
  prefix: string | null;
  select: boolean | null;
  isDirty: number | null;
}

export interface ICategory {
  category: string | null;
  select: boolean | null;
}

export interface  IFilterEmployee extends IBaseFilter  {

  scopeFromFlag: boolean | null;
  scopeUntilFlag: boolean | null;
  scopeFrom: Date | null;
  internalScopeFrom: NgbDateStruct| null;
  scopeUntil: Date | null;
  internalScopeUntil: NgbDateStruct| null;
  showDeleteEntries: | boolean | null;



  searchOnlyByName: | boolean | null;

  male: | boolean | null;
  female: | boolean | null;
  
  ktnAG: | boolean | null;
  ktnAI: | boolean | null;
  ktnAR: | boolean | null;
  ktnBE: | boolean | null;
  ktnBL: | boolean | null;
  ktnBS: | boolean | null;
  ktnFR: | boolean | null;
  ktnGE: | boolean | null;
  ktnGL: | boolean | null;
  ktnGR: | boolean | null;
  ktnJU: | boolean | null;
  ktnLU: | boolean | null;
  ktnNE: | boolean | null;
  ktnNW: | boolean | null;
  ktnOW: | boolean | null;
  ktnSG: | boolean | null;
  ktnSH: | boolean | null;
  ktnSO: | boolean | null;
  ktnSZ: | boolean | null;
  ktnTG: | boolean | null;
  ktnTI: | boolean | null;
  ktnUR: | boolean | null;
  ktnVD: | boolean | null;
  ktnVS: | boolean | null;
  ktnZG: | boolean | null;
  ktnZH: | boolean | null;
  ktnNull: | boolean | null;

  countriesHaveBeenReadIn: boolean;
  countries: ICountry[] | null;
 
  activeMembership: | boolean | null;
  formerMembership: | boolean | null;
  futureMembership: | boolean | null;

  hasAnnotation: | boolean | null;


}

export interface ITruncatedFilter {

  searchString: | string | null;
  orderBy: string;
  sortOrder: string;
  numberOfItemsPerPage: number;
  requiredPage: number;

}

export interface ITruncatedDocumentHistory  extends IBaseTruncated  {

  documentHistories: IDocumentHistory[];
  editor: string | null;
  lastChange: Date | null;

}

export interface ITruncatedEmployee extends IBaseTruncated {

  employees: IEmployee[];
  editor: string | null;
  lastChange: Date | null;

}


export interface IEmployee extends BaseEntity {


  id: | string | null;
  idNumber: number | string | null;
  company: string;
  title: string | null;
  name: string;
  firstName: string;
  secondName: string;
  maidenName: string;
  birthdate: Date | string | null;
  staff: IStaff ;
  gender: | string | null;
  legalEntity: boolean;
  type: number | string;
  addresses: Array<IAddress>;
  communications: Array<ICommunication>;
 
  annotations: Array<IAnnotation>;
  internalBirthdate: NgbDateStruct | null;

  hasFutureAddress: boolean;
  hasPastAddress: boolean;
  hasScopeAddress: boolean;

  typeAbbreviation: string | null;
}

export interface IAddress extends IBaseEntity {

  id: | string | null;
  employeeId: | string | null;
  validFrom: Date | string ;
  type: | number | null;
  addressLine1: string;
  addressLine2: string;
  street: string;
  street2: string;
  street3: string;
  zip: string;
  city: string;
  state: string;
  country: string;
  isScoped: boolean;
  isFuture: boolean;

  internalValidFrom: NgbDateStruct| null;
}

export interface ICommunication extends IBaseEntity {

  prefix: string;
  isPhone: boolean;
  isEmail: boolean;
  id: | string | null;
  employeeId: | string | null;
  type: | number;
  value: string;
  index: | number;
  internalId: | string | null;

}



export interface IStaff extends BaseEntity {

  id: | string | null;
  employeeId: | string | null;
  employee: | IEmployee | null;
  validFrom: Date | string ;
  validUntil: Date | string | any;
  type: number | string;
  internalValidFrom: NgbDateStruct| null;
  internalValidUntil: NgbDateStruct| null;


}


export interface IAnnotation extends BaseEntity {
  id: | string | null;
  employeeId: | string | null;
  note: string | null;
}


export class TruncatedEmployee extends BaseTruncated implements ITruncatedEmployee {
  employees = [];
  editor = null;
  lastChange = null;
}

export class TruncatedDocumentHistory extends BaseTruncated  implements ITruncatedDocumentHistory {

  documentHistories = [];
  editor = null;
  lastChange = null;
}

export class Address extends BaseEntity implements IAddress {

  id = '';
  employeeId = '';
  validFrom = new Date();
  type = 0;
  addressLine1 = '';
  addressLine2 = '';
  street = '';
  street2 = '';
  street3 = '';
  zip = '';
  city = '';
  state = '';
  country = '';
  isScoped = true;
  isFuture = false;
  internalValidFrom = null;
}

export class Communication extends BaseEntity implements ICommunication {

  prefix = '';
  id = '';
  employeeId = '';
  type = 0;
  value = '';
  isPhone = false;
  isEmail = false;
  index = 0;
  internalId = null;

}

export class Annotation extends BaseEntity implements IAnnotation {
  id = '';
  employeeId = '';
  note = '';

}

export class Employee extends BaseEntity implements IEmployee {



  constructor() {
    super();

    this.communications = [];
       const addr = new Address();
    this.addresses = [addr];

    const ann = new Annotation();
    this.annotations = [ann];
  }


  id = null;
  idNumber = null;
  company = '';
  title = '';
  name = '';
  firstName = '';
  secondName = '';
  maidenName = '';
  birthdate = null;
  gender = '0';
  legalEntity = false;
  type = 0;

  staff = new Staff();
  addresses: Array<IAddress>;
 
  communications: Array<ICommunication>;
  annotations: Array<IAnnotation>;

  internalBirthdate = null;

  hasFutureAddress = false;
  hasPastAddress = false;
  hasScopeAddress = false;

  typeAbbreviation = null;

}



export class Staff extends BaseEntity implements IStaff {

  

  id = '';
  employeeId = '';
  employee = null;
  validFrom = new Date();
  validUntil = null;
  status = null;
  section = null;
  type = 0;
 

  internalValidFrom = null;
  internalValidUntil = null;

}


export class FilterEmployee extends BaseFilter implements IFilterEmployee {

  scopeFromFlag = null;
  scopeUntilFlag = null;
  scopeFrom = null;
  internalScopeFrom = null;
  scopeUntil = null;
  internalScopeUntil = null;
  showDeleteEntries = false;

  includeAddress = false;
  
  searchOnlyByName = null;

  countriesHaveBeenReadIn = false;
  numberOfItemsPerPage = 0;
  requiredPage = 0;

  orderBy = 'name';
  sortOrder = 'asc';
 

  male = true;
  female = true;
  legalEntity = true;

  companyAddress = true;
  invoiceAddress = true;
  homeAddress = true;

  hasSections = false;
  hasStatus = false;

  ktnAG = true;
  ktnAI = true;
  ktnAR = true;
  ktnBE = true;
  ktnBL = true;
  ktnBS = true;
  ktnFR = true;
  ktnGE = true;
  ktnGL = true;
  ktnGR = true;
  ktnJU = true;
  ktnLU = true;
  ktnNE = true;
  ktnNW = true;
  ktnOW = true;
  ktnSG = true;
  ktnSH = true;
  ktnSO = true;
  ktnSZ = true;
  ktnTG = true;
  ktnTI = true;
  ktnUR = true;
  ktnVD = true;
  ktnVS = true;
  ktnZG = true;
  ktnZH = true;
  ktnNull = true;

  countries = new Array<ICountry>();
  

  activeMembership = true;
  formerMembership = false;
  futureMembership = false;

  hasAnnotation = false;

  isEmpty(): boolean {

    return  !this.showDeleteEntries &&
      this.male && this.female &&
      this.activeMembership && !this.formerMembership && !this.futureMembership && !this.hasAnnotation &&
      this.scopeFrom === null && this.scopeUntil === null &&
      this.scopeFromFlag === null && this.scopeUntilFlag === null && this.internalScopeFrom === null && this.internalScopeUntil === null;

  }

  setEmpty() {
    this.showDeleteEntries = false;
    
    this.scopeFrom = null;
    this.scopeUntil = null;
    this.scopeFromFlag = null;
    this.scopeUntilFlag = null;
    this.internalScopeFrom = null;
    this.internalScopeUntil = null;


    this.male = true;
    this.female = true;
    this.legalEntity = true;
    
    this.activeMembership = true;
    this.formerMembership = false;
    this.futureMembership = false;

    this.hasAnnotation = false;
   
    this.selectCountries(true);
   
  }

  selectState(value: boolean) {

    this.ktnAG = value;
    this.ktnAI = value;
    this.ktnAR = value;
    this.ktnBE = value;
    this.ktnBL = value;
    this.ktnBS = value;
    this.ktnFR = value;
    this.ktnGE = value;
    this.ktnGL = value;
    this.ktnGR = value;
    this.ktnJU = value;
    this.ktnLU = value;
    this.ktnNE = value;
    this.ktnNW = value;
    this.ktnOW = value;
    this.ktnSG = value;
    this.ktnSH = value;
    this.ktnSO = value;
    this.ktnSZ = value;
    this.ktnTG = value;
    this.ktnTI = value;
    this.ktnUR = value;
    this.ktnVD = value;
    this.ktnVS = value;
    this.ktnZG = value;
    this.ktnZH = value;
    this.ktnNull = value;
  }

  selectCountries(value: boolean) {
    if (this.countries) {
      this.countries.forEach(country => {
        country.select = value;
      });
    }
  }

 
  stateStatus(): boolean {
    return this.ktnAG &&
      this.ktnAI &&
      this.ktnAR &&
      this.ktnBE &&
      this.ktnBL &&
      this.ktnBS &&
      this.ktnFR &&
      this.ktnGE &&
      this.ktnGL &&
      this.ktnGR &&
      this.ktnJU &&
      this.ktnLU &&
      this.ktnNE &&
      this.ktnNW &&
      this.ktnOW &&
      this.ktnSG &&
      this.ktnSH &&
      this.ktnSO &&
      this.ktnSZ &&
      this.ktnTG &&
      this.ktnTI &&
      this.ktnUR &&
      this.ktnVD &&
      this.ktnVS &&
      this.ktnZG &&
      this.ktnZH &&
      this.ktnNull;
  }

  countriesStatus(): boolean {
    let status = true;

    if (this.countries && this.countries.length !== 0) {
      this.countries.forEach(country => {
        if (!country.select) {
          status = false;
        }
      });
    }

    return status;
  }


  
}

export class TruncatedFilter implements ITruncatedFilter {
  searchString = '';
  orderBy = 'name';
  sortOrder = 'asc';
  numberOfItemsPerPage = 0;
  requiredPage = 0;
}


export interface ICheckBoxValue {
  id: string | null;
  Checked: boolean;
}

export class CheckBoxValue implements ICheckBoxValue {
  id = null;
  Checked = false;
}

export interface ICommunicationType {
  id: number;
  name: string;
  type: number;
  category: number;
  defaultIndex: number;
}

export class CommunicationType implements ICommunicationType {
  id = 0;
  name = '';
  type = 0;
  category = 0;
  defaultIndex = 0;
}

export interface ICommunicationPrefix {
  id: string;
  prefix: string;
  name: string;
}

export class CommunicationPrefix implements ICommunicationPrefix {
  id = '';
  prefix = '';
  name = '';
}

export class Country implements ICountry {
  id = null;
  abbreviation = '';
  name = '';
  prefix = '';
  select = false;
  isDirty = 0;
}


export interface ILastChangeMetaData {
  lastChangesDate: Date;
  autor: string;
}


export interface IHistory {

  id: string | null;
  clientId: string | null;
  client: IEmployee;
  validFrom: Date;
  type: number;
  data: string | null;
  oldData: string | null;
  newData: string | null;
  currentUserCreated: string | null;

}

export interface IFilterHistory {


  orderBy: string;
  sortOrder: string;
  numberOfItemsPerPage: number;
  requiredPage: number;
  maxItems: number;
  key: | string ;

}

export class FilterHistory implements IFilterHistory {
  orderBy = 'validFrom';
  sortOrder = 'desc';
  maxItems = 0;
  numberOfItemsPerPage = 5;
  requiredPage = 1;
  key = '';

}

export interface ITruncatedHistory {

  maxItems: number;
  maxPages: number;
  currentPage: number;
  key: string;
  histories: IHistory[];

}

export class TruncatedHistory implements ITruncatedHistory {

  maxItems = 0;
  maxPages = 0;
  currentPage = 0;
  key = '';
  histories: IHistory[] = [];

}
